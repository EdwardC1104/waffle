using api.Features.User;

namespace api.Features.Post;

public class PostDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public UserDto Author { get; set; } = new UserDto();
    public string CoverImageUrl { get; set; } = string.Empty;
    public int LikeCount { get; set; }
    public bool LikedByAuthenticatedUser { get; set; }
}