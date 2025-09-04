using System.ComponentModel.DataAnnotations;

namespace api.Features.Like.CreateLike;

public class CreateLikeCommand
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}