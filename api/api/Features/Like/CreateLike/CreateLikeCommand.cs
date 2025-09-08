using System.ComponentModel.DataAnnotations;
using api.Features.Post;
using MediatR;

namespace api.Features.Like.CreateLike;

public record CreateLikeCommand : IRequest<PostDto>
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}