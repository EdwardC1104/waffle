using System.ComponentModel.DataAnnotations;
using api.Features.User;
using MediatR;

namespace api.Features.Auth.Login;

public class LoginCommand : IRequest<UserDto>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
        
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}