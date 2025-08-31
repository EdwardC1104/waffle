using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.GetFollowing;

public class GetFollowingQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}