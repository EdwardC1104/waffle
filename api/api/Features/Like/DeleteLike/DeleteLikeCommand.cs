using System.ComponentModel.DataAnnotations;
using api.Features.Post;
using MediatR;

namespace api.Features.Like.DeleteLike;

public record DeleteLikeCommand : IRequest<PostDto>
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}