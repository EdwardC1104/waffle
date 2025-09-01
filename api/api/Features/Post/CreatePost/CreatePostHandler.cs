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

    public async Task<PostDto?> Handle(string userId, CreatePostCommand request)
    {
        var newPost = new api.Models.Post
        {
            Title = request.Title,
            Content = request.Content,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            CoverImageUrl = request.CoverImageUrl,
        };
        
        _dbContext.Posts.Add(newPost);
        await _dbContext.SaveChangesAsync();
        
        // Return the created post with author information
        return await newPost.ToDtoAsync(userId, _dbContext);
    }
}