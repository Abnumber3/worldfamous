using System.Text;
using Core.Entities.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace api.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(
            this IServiceCollection services,
            IConfiguration config)
        {
            // Read once and fail fast if missing
            var issuer = config["Token:Issuer"];
            var keyStr = config["Token:Key"];

            Console.WriteLine($"[AuthBoot] ENV={Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}");
            Console.WriteLine($"[AuthBoot] Token:Issuer='{issuer}'");
            Console.WriteLine($"[AuthBoot] Token:Key length={(keyStr?.Length ?? 0)}");

            if (string.IsNullOrWhiteSpace(issuer))
                throw new InvalidOperationException("Token:Issuer is missing or empty in configuration.");
            if (string.IsNullOrWhiteSpace(keyStr))
                throw new InvalidOperationException("Token:Key is missing or empty in configuration.");

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));

            // Identity (EF stores + sign-in manager)
            var id = services.AddIdentityCore<AppUser>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
            });

            new IdentityBuilder(id.UserType, id.Services)
                .AddEntityFrameworkStores<AppIdentityDbContext>()
                .AddSignInManager<SignInManager<AppUser>>();

            // JWT Bearer
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true; // you're on HTTPS locally
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = signingKey,

                        ValidateIssuer = true,
                        ValidIssuer = issuer,         // MUST match token `iss`

                        ValidateAudience = false,     // we’re not using aud
                        ClockSkew = TimeSpan.Zero
                    };

                    // Optional diagnostics
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = ctx =>
                        {
                            Console.WriteLine("[JWT] Auth failed: " + ctx.Exception.Message);
                            return Task.CompletedTask;
                        },
                        OnChallenge = ctx =>
                        {
                            Console.WriteLine("[JWT] Challenge: " + ctx.ErrorDescription);
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization();
            return services;
        }
    }
}
