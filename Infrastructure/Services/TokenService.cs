using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        private readonly string _issuer;

        public TokenService(IConfiguration config)
        {
            _config = config;

            var keyStr = _config["Token:Key"];
            _issuer = _config["Token:Issuer"];   // <-- NO SPACE

            if (string.IsNullOrWhiteSpace(keyStr))
                throw new InvalidOperationException("Token:Key is missing.");
            if (string.IsNullOrWhiteSpace(_issuer))
                throw new InvalidOperationException("Token:Issuer is missing.");

            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
        }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.GivenName, user.DisplayName ?? user.UserName ?? "User"),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id ?? Guid.NewGuid().ToString())
            };

            // HS256 is typical; HS512 also works, but keep it consistent with your project.
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

            var descriptor = new SecurityTokenDescriptor
            {
                Issuer = _issuer,                 // sets `iss` in the JWT
                Audience = null,                  // you’re not validating audience
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds
            };

            var handler = new JwtSecurityTokenHandler();
            var token = handler.CreateToken(descriptor);
            return handler.WriteToken(token);
        }
    }
}
