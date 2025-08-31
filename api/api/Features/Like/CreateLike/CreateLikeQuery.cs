using System.ComponentModel.DataAnnotations;

namespace api.Features.Like.CreateLike;

public class CreateLikeQuery
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}