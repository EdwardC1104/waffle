using System.ComponentModel.DataAnnotations;
using api.Features.User;
using MediatR;

namespace api.Features.Follow.GetFollowers;

public record GetFollowersQuery : IRequest<IEnumerable<UserDto>>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}