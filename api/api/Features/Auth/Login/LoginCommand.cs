using System.ComponentModel.DataAnnotations;

namespace api.Features.Auth.Login;

public class LoginCommand
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
        
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}