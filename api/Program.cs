using Infrastructure.Data;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Microsoft.Extensions.Logging;
using AutoMapper;
using api.Helpers;
using api.Middleware;
using System.Numerics;
using Microsoft.AspNetCore.Mvc;
using api.Errors;
using api.Extensions;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add DbContext
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
         
});

builder.Services.AddApplicationServices();


var app = builder.Build();

// Configure the HTTP request pipeline.

    app.UseMiddleware<ExceptionMiddleware>();
    app.UseSwaggerServices();

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();
app.MapControllers();
app.UseStaticFiles();

// Apply migrations and seed the database on startup
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<StoreContext>();
var logger = services.GetRequiredService<ILogger<Program>>();

try
{
    // Apply migrations at startup
    await context.Database.MigrateAsync();
    // Seed the database with initial data
    await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred during migration or seeding");
}

app.Run();
