using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Post.CreatePost;

public class CreatePostCommand : IRequest<PostDto>
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters")]
    public string Title { get; set; } = string.Empty;
        
    [Required(ErrorMessage = "Content is required")]
    [MinLength(1, ErrorMessage = "Content cannot be empty")]
    public string Content { get; set; } = string.Empty;
    
    public string UserId { get; set; } = null!;
    public string? CoverImageUrl { get; set; }
}