using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.GetFollowers;

public class GetFollowersQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}