using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Features.Post;

public class CreatePost
{
    private readonly AppDbContext _dbContext;
    
    public CreatePost(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public class Request
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Content is required")]
        [MinLength(1, ErrorMessage = "Content cannot be empty")]
        public string Content { get; set; } = string.Empty;
    }
    
    public class Response
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public AuthorDto Author { get; set; } = new AuthorDto();
        public string CoverImageUrl { get; set; } = string.Empty;
    }

    public class AuthorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }

    public async Task<Response?> Handle(Request request, string username)
    {
        // First check if the user exists
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
            
        if (user == null)
        {
            return null;
        }
        
        // Create new post
        var newPost = new api.Models.Post
        {
            Title = request.Title,
            Content = request.Content,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow
        };
        
        _dbContext.Posts.Add(newPost);
        await _dbContext.SaveChangesAsync();
        
        // Return the created post with author information
        return new Response
        {
            Id = newPost.Id,
            Title = newPost.Title,
            Content = newPost.Content,
            CreatedAt = newPost.CreatedAt,
            Author = new AuthorDto
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            },
            CoverImageUrl = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop"
        };
    }
}