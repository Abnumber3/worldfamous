using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string RetrieveEmailFromPrincipal(this ClaimsPrincipal user)
        {
            // return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            return user.FindFirstValue(JwtRegisteredClaimNames.Email);
            
        }
    }
}