using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.EditPost;

public class EditPostHandler
{
    private readonly AppDbContext _dbContext;
    
    public EditPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto?> Handle(string username, EditPostCommand request)
    {
        // First check if the user exists
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
            
        if (user == null)
        {
            return null;
        }
        
        // Find the post and verify ownership
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == user.Id);
        
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
        }
        
        if (request.CoverImageUrl != null)
        {
            post.CoverImageUrl = request.CoverImageUrl;
        }
        
        // Update the modification timestamp
        post.UpdatedAt = DateTime.UtcNow;
        
        await _dbContext.SaveChangesAsync();
        
        // Return the updated post
        return await post.ToDtoAsync(user.Id, _dbContext);
    }
}