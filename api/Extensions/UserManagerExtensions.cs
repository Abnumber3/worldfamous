using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Extensions
{
    public static class UserManagerExtensions
    {
        private static string GetUserIdFlexible(this UserManager<AppUser> userManager, ClaimsPrincipal principal)
        {
            if (principal?.Identity?.IsAuthenticated != true) return null;

            // Respect configured claim type first
            var id = userManager.GetUserId(principal);
            if (!string.IsNullOrWhiteSpace(id)) return id;

            // Fallbacks
            id = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                 ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                 ?? principal.FindFirstValue("sub");

            return string.IsNullOrWhiteSpace(id) ? null : id;
        }

        public static async Task<AppUser> FindByIdFromClaimsAsync(
            this UserManager<AppUser> userManager,
            ClaimsPrincipal principal)
        {
            var userId = userManager.GetUserIdFlexible(principal);
            if (string.IsNullOrWhiteSpace(userId)) return null;

            return await userManager.Users.SingleOrDefaultAsync(u => u.Id == userId);
        }

        public static async Task<AppUser> FindUserWithAddressByIdAsync(
            this UserManager<AppUser> userManager,
            ClaimsPrincipal principal)
        {
            var userId = userManager.GetUserIdFlexible(principal);
            if (string.IsNullOrWhiteSpace(userId)) return null;

            return await userManager.Users
                .Include(u => u.Address)
                .SingleOrDefaultAsync(u => u.Id == userId);
        }
    }
}
