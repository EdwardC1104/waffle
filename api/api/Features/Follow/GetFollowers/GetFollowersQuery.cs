using System.ComponentModel.DataAnnotations;
using api.Features.User;
using MediatR;

namespace api.Features.Follow.GetFollowers;

public class GetFollowersQuery : IRequest<IEnumerable<UserDto>>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
    public string? AuthenticatedUserId { get; set; }
}