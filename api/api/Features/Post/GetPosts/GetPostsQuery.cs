using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.GetPosts;

public class GetPostsQuery : IRequest<IEnumerable<PostDto>>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
    public string? AuthenticatedUserId { get; set; }
}