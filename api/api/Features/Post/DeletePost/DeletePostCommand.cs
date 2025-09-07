using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.DeletePost;

public record DeletePostCommand : IRequest
{
    [Required(ErrorMessage = "Post ID is required")]
    public int PostId { get; set; }
}
