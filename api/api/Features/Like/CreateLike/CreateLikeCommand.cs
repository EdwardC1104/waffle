using System.ComponentModel.DataAnnotations;
using api.Features.Post;
using MediatR;

namespace api.Features.Like.CreateLike;

public class CreateLikeCommand : IRequest<PostDto>
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
    public string UserId { get; set; } = null!;
}