using System.ComponentModel.DataAnnotations;

namespace api.Dtos
{
    public class GoogleLoginDto
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;
    }
}
