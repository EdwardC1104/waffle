using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.DeletePost;

public class DeletePostCommand : IRequest
{
    [Required(ErrorMessage = "Post ID is required")]
    public int PostId { get; set; }
    public string UserId { get; set; } = null!;
}
