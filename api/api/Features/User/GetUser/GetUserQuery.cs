using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.User.GetUser;

public record GetUserQuery : IRequest<UserDto>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}