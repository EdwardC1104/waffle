using System.ComponentModel.DataAnnotations;

namespace api.Features.Like.DeleteLike;

public class DeleteLikeCommand
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}