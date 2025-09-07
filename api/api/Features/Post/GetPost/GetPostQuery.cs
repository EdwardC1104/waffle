using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.GetPost;

public record GetPostQuery : IRequest<PostDto>
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}