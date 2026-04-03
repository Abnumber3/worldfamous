using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.RegularExpressions;
using api.Dtos;
using api.Errors;
using api.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    public class AccountController : BaseApiController
    {
        private static readonly ConfigurationManager<OpenIdConnectConfiguration> GoogleConfigurationManager = new(
            "https://accounts.google.com/.well-known/openid-configuration",
            new OpenIdConnectConfigurationRetriever(),
            new HttpDocumentRetriever { RequireHttps = true });

        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper,
            IConfiguration configuration)
        {
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByIdFromClaimsAsync(User);
            if (user == null) return Unauthorized(new ApiResponse(401, "User not found"));

            return CreateUserObject(user);
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var user = await _userManager.FindUserWithAddressByIdAsync(User);
            if (user == null) return Unauthorized(new ApiResponse(401, "User not found"));

            if (user.Address == null)
                return NotFound(new ApiResponse(404, "Address not set"));

            return Ok(_mapper.Map<AddressDto>(user.Address));
        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindUserWithAddressByIdAsync(User);
            if (user == null) return Unauthorized(new ApiResponse(401, "User not found"));

            user.Address = _mapper.Map<AddressDto, Address>(address);

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));

            return BadRequest("Problem updating the user");
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401, "Invalid Email"));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized(new ApiResponse(401, "Invalid password"));

            return CreateUserObject(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = ["Email address is in use"] });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            return CreateUserObject(user);
        }

        [HttpGet("usernameexists")]
        public async Task<ActionResult<bool>> CheckUsernameExistsAsync([FromQuery] string username)
        {
            return await _userManager.FindByNameAsync(username) != null;
        }

        [HttpGet("google-config")]
        public ActionResult<GoogleAuthConfigDto> GetGoogleAuthConfig()
        {
            var clientId = _configuration["Authentication:Google:ClientId"] ?? string.Empty;

            return new GoogleAuthConfigDto
            {
                ClientId = clientId,
                Enabled = !string.IsNullOrWhiteSpace(clientId)
            };
        }

        [HttpPost("google")]
        public async Task<ActionResult<UserDto>> GoogleLogin(GoogleLoginDto googleLoginDto)
        {
            var clientId = _configuration["Authentication:Google:ClientId"];
            if (string.IsNullOrWhiteSpace(clientId))
            {
                return BadRequest(new ApiResponse(400, "Google sign-in is not configured."));
            }

            if (string.IsNullOrWhiteSpace(googleLoginDto.IdToken))
            {
                return BadRequest(new ApiResponse(400, "Google token is required."));
            }

            var googleProfile = await ValidateGoogleTokenAsync(googleLoginDto.IdToken, clientId);
            if (googleProfile == null || string.IsNullOrWhiteSpace(googleProfile.Email) || !googleProfile.EmailVerified)
            {
                return Unauthorized(new ApiResponse(401, "Invalid Google sign-in."));
            }

            var user = await _userManager.FindByEmailAsync(googleProfile.Email);
            if (user == null)
            {
                user = new AppUser
                {
                    DisplayName = googleProfile.DisplayName,
                    Email = googleProfile.Email,
                    UserName = await GenerateUniqueUsernameAsync(googleProfile.Email.Split('@')[0]),
                    EmailConfirmed = true
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return BadRequest(new ApiValidationErrorResponse
                    {
                        Errors = createResult.Errors.Select(error => error.Description)
                    });
                }
            }
            else
            {
                var shouldUpdateUser = false;

                if (!user.EmailConfirmed)
                {
                    user.EmailConfirmed = true;
                    shouldUpdateUser = true;
                }

                if (string.IsNullOrWhiteSpace(user.DisplayName) && !string.IsNullOrWhiteSpace(googleProfile.DisplayName))
                {
                    user.DisplayName = googleProfile.DisplayName;
                    shouldUpdateUser = true;
                }

                if (shouldUpdateUser)
                {
                    var updateResult = await _userManager.UpdateAsync(user);
                    if (!updateResult.Succeeded)
                    {
                        return BadRequest(new ApiValidationErrorResponse
                        {
                            Errors = updateResult.Errors.Select(error => error.Description)
                        });
                    }
                }
            }

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<GoogleProfileInfo?> ValidateGoogleTokenAsync(string idToken, string clientId)
        {
            var configuration = await GoogleConfigurationManager.GetConfigurationAsync(HttpContext.RequestAborted);
            var handler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuers = ["https://accounts.google.com", "accounts.google.com"],
                ValidateAudience = true,
                ValidAudience = clientId,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = configuration.SigningKeys,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(1)
            };

            try
            {
                var principal = handler.ValidateToken(idToken, validationParameters, out _);
                var email = principal.FindFirst("email")?.Value ?? principal.FindFirst(ClaimTypes.Email)?.Value;
                var displayName =
                    principal.FindFirst("name")?.Value ??
                    principal.FindFirst("given_name")?.Value ??
                    email?.Split('@')[0];
                var emailVerified = bool.TryParse(principal.FindFirst("email_verified")?.Value, out var verified) && verified;

                return new GoogleProfileInfo
                {
                    Email = email,
                    DisplayName = displayName ?? "World Famous Member",
                    EmailVerified = emailVerified
                };
            }
            catch
            {
                return null;
            }
        }

        private async Task<string> GenerateUniqueUsernameAsync(string seed)
        {
            var baseUsername = Regex.Replace(seed.ToLowerInvariant(), "[^a-z0-9]+", string.Empty);

            if (string.IsNullOrWhiteSpace(baseUsername))
            {
                baseUsername = "wfmember";
            }

            if (baseUsername.Length < 6)
            {
                baseUsername = baseUsername.PadRight(6, 'x');
            }

            if (baseUsername.Length > 18)
            {
                baseUsername = baseUsername[..18];
            }

            var candidate = baseUsername;
            var suffix = 1;

            while (await _userManager.FindByNameAsync(candidate) != null)
            {
                var suffixText = suffix.ToString();
                var maxBaseLength = Math.Max(6, 18 - suffixText.Length);
                var basePortion = baseUsername[..Math.Min(baseUsername.Length, maxBaseLength)];
                candidate = $"{basePortion}{suffixText}";
                suffix++;
            }

            return candidate;
        }

        private sealed class GoogleProfileInfo
        {
            public string? Email { get; init; }
            public string? DisplayName { get; init; }
            public bool EmailVerified { get; init; }
        }
    }
}
