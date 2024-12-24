using Infrastructure.Data;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Add DbContext
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     var loggerFactory = services.GetRequiredService<ILoggerFactory>();  // Get ILoggerFactory

//     try
//     {
//         var context = services.GetRequiredService<StoreContext>();
//         var logger = loggerFactory.CreateLogger<Program>();  // Create logger for Program class
//         await context.Database.MigrateAsync();
//         logger.LogInformation("Database migrations applied successfully.");
        
//         // Pass the logger to the SeedAsync method
//         await StoreContextSeed.SeedAsync(context, loggerFactory);
//     }
//     catch (Exception ex)
//     {
//         var logger = loggerFactory.CreateLogger<Program>();  // Create logger for Program class again for error logging
//         logger.LogError(ex, "An error occurred during migration");
//     }
// }

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<StoreContext>();
var logger = services.GetRequiredService<ILogger<Program>>();

try
{
    await context.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred during migration");
}



app.Run();
