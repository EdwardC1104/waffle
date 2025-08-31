using System.ComponentModel.DataAnnotations;

namespace api.Features.Post.GetPosts;

public class GetPostsQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}