using System.ComponentModel.DataAnnotations;
using api.Features.User;
using MediatR;

namespace api.Features.Follow.GetFollowing;

public record GetFollowingQuery : IRequest<IEnumerable<UserDto>>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}