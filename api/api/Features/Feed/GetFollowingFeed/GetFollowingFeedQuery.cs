using System.ComponentModel.DataAnnotations;

namespace api.Features.Feed.GetFollowingFeed;

public class GetFollowingFeedQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}