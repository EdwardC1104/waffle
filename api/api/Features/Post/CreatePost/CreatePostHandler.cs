using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Features.User;

namespace api.Features.Post.CreatePost;

public class CreatePostHandler
{
    private readonly AppDbContext _dbContext;
    
    public CreatePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto?> Handle(CreatePostCommand request)
    {
        // First check if the user exists
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == request.Username);
            
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
        return new PostDto
        {
            Id = newPost.Id,
            Title = newPost.Title,
            Content = newPost.Content,
            CreatedAt = newPost.CreatedAt,
            Author = new UserDto
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