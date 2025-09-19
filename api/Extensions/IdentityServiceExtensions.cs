using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
            var issuer = config["Token:Issuer"];
            var keyStr = config["Token:Key"];

            if (string.IsNullOrWhiteSpace(issuer))
                throw new InvalidOperationException("Token:Issuer missing in configuration.");
            if (string.IsNullOrWhiteSpace(keyStr))
                throw new InvalidOperationException("Token:Key missing in configuration.");

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));

            // Identity setup
            var id = services.AddIdentityCore<AppUser>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
            });

            new IdentityBuilder(id.UserType, id.Services)
                .AddEntityFrameworkStores<AppIdentityDbContext>()
                .AddSignInManager<SignInManager<AppUser>>();

            // Prevent inbound claim type mapping (keeps "sub", "email" as-is)
            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true; // keep true in prod
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = signingKey,
                        ValidateIssuer = true,
                        ValidIssuer = issuer,
                        ValidateAudience = false,
                        ClockSkew = TimeSpan.Zero,

                        // Tell ASP.NET which claims represent identity
                        NameClaimType = JwtRegisteredClaimNames.Email,
                        RoleClaimType = ClaimTypes.Role
                    };
                });

            services.Configure<IdentityOptions>(opt =>
            {
                opt.ClaimsIdentity.UserIdClaimType = JwtRegisteredClaimNames.Sub;
                opt.ClaimsIdentity.UserNameClaimType = JwtRegisteredClaimNames.Email;
            });

            services.AddAuthorization();

            return services;
        }
    }
}
