using System;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Infrastructure.Identity;

namespace api.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services)
    {
        var builder = services.AddIdentityCore<AppUser>();

        builder = new IdentityBuilder(builder.UserType, builder.Services);
        builder.AddEntityFrameworkStores<AppIdentityDbContext>();
        builder.AddSignInManager<SignInManager<AppUser>>();

        return services;
    }

   
}
