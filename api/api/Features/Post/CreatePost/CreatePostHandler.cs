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

    public async Task<PostDto?> Handle(string username, CreatePostCommand request)
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
        return await newPost.ToDtoAsync(username, _dbContext);
    }
}