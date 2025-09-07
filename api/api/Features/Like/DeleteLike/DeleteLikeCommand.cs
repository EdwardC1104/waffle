using System.ComponentModel.DataAnnotations;
using api.Features.Post;
using MediatR;

namespace api.Features.Like.DeleteLike;

public class DeleteLikeCommand : IRequest<PostDto>
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
    public string UserId { get; set; } = null!;
}