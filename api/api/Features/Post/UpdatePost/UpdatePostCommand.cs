using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.UpdatePost;

public class UpdatePostCommand : IRequest<PostDto>
{
    [Required(ErrorMessage = "Post ID is required")]
    public int PostId { get; set; }
    
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string? Title { get; set; }
    
    public string? Content { get; set; }
    
    public string UserId { get; set; } = null!;
    public string? CoverImageUrl { get; set; }
}