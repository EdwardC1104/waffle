using System.ComponentModel.DataAnnotations;

namespace api.Features.Post.DeletePost;

public class DeletePostCommand
{
    [Required(ErrorMessage = "Post ID is required")]
    public int PostId { get; set; }
}
