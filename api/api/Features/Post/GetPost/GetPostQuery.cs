using System.ComponentModel.DataAnnotations;

namespace api.Features.Post.GetPost;

public class GetPostQuery
{
    [Required(ErrorMessage = "PostId is required")]
    public int PostId { get; set; }
}