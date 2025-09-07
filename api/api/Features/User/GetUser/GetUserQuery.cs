using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.User.GetUser;

public class GetUserQuery : IRequest<UserDto>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
    public string? AuthenticatedUserId { get; set; }
}