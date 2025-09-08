using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.GetPosts;

public record GetPostsQuery : IRequest<IEnumerable<PostDto>>
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}