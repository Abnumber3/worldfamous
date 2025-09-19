// Infrastructure/Services/TokenService.cs
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
        private readonly SymmetricSecurityKey _signingKey;
        private readonly string _issuer;

        public TokenService(IConfiguration config)
        {
            var keyStr = config["Token:Key"];
            _issuer    = config["Token:Issuer"];

            if (string.IsNullOrWhiteSpace(keyStr))
                throw new InvalidOperationException("Token:Key is missing.");
            if (string.IsNullOrWhiteSpace(_issuer))
                throw new InvalidOperationException("Token:Issuer is missing.");

            _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
        }

   
        public string CreateToken(AppUser user)
{
    var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
        new Claim(JwtRegisteredClaimNames.GivenName, user.DisplayName ?? user.UserName ?? "User")
    };

    var creds = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha512);
    var token = new JwtSecurityToken(
        issuer: _issuer,
        audience: null,
        claims: claims,
        expires: DateTime.UtcNow.AddDays(7),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }
}
