using System.ComponentModel.DataAnnotations;

namespace api.Features.Feed.GetFypFeed;

public class GetFypFeedQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}