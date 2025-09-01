using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.UpdatePost;

public class UpdatePostHandler
{
    private readonly AppDbContext _dbContext;
    
    public UpdatePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto?> Handle(string userId, UpdatePostCommand request)
    {
        // Find the post and verify ownership
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == userId);
        
        if (post == null)
        {
            return null; // Post not found or user doesn't own it
        }
        
        // Update only the fields that are provided
        if (!string.IsNullOrEmpty(request.Title))
        {
            post.Title = request.Title;
        }
        
        if (request.Content != null)
        {
            post.Content = request.Content;
            post.WordCount = post.Content.Split(new char[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Length;
        }
        
        if (request.CoverImageUrl != null)
        {
            post.CoverImageUrl = request.CoverImageUrl;
        }
        
        // Update the modification timestamp
        post.UpdatedAt = DateTime.UtcNow;
        
        await _dbContext.SaveChangesAsync();
        
        // Return the updated post
        return await post.ToDtoAsync(userId, _dbContext);
    }
}