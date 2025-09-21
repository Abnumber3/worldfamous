using Infrastructure.Data;
using Infrastructure.Identity;
using Infrastructure.Services;          // <— add (for TokenService)
using Core.Interfaces;                  // <— add (for ITokenService)
using Core.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using StackExchange.Redis;
using api.Extensions;
using api.Helpers;
using api.Middleware;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerServices();  // <— use extension method

// ✅ Register Identity/JWT ONCE using the real configuration
builder.Services.AddIdentityServices(builder.Configuration);

// ✅ Token service to create JWTs with 'iss'
builder.Services.AddScoped<ITokenService, TokenService>();

// DbContexts
builder.Services.AddDbContext<AppIdentityDbContext>(x =>
{
    x.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection"));
});

builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
{
    var configuration = ConfigurationOptions.Parse(builder.Configuration.GetConnectionString("Redis"), true);
    return ConnectionMultiplexer.Connect(configuration);
});

// CORS (you said frontend is HTTPS)
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policyBuilder =>
    {
        policyBuilder.WithOrigins("https://localhost:4200")
                     .AllowAnyHeader()
                     .AllowAnyMethod()
                     .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddApplicationServices();

var app = builder.Build();

// Pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseSwaggerServices();

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();   // must be before authorization
app.UseAuthorization();

app.MapControllers();

// Migrate + seed
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var store = services.GetRequiredService<StoreContext>();
        await store.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(store);

        var identity = services.GetRequiredService<AppIdentityDbContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        await identity.Database.MigrateAsync();
        await AppIdentityDbContextSeed.SeedUsersAsync(userManager);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during migration or seeding");
    }
}

app.Run();
