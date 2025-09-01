using System.ComponentModel.DataAnnotations;

namespace api.Features.Post.EditPost;

public class EditPostCommand
{
    [Required(ErrorMessage = "Post ID is required")]
    public int PostId { get; set; }
    
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string? Title { get; set; }
    
    public string? Content { get; set; }
    
    public string? CoverImageUrl { get; set; }
}