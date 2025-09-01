using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.DeletePost;

public class DeletePostHandler
{
    private readonly AppDbContext _dbContext;
    
    public DeletePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(string userId, DeletePostCommand request)
    {
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == userId);
        
        if (post == null)
        {
            return false; // Post not found or user doesn't own it
        }
        
        // Delete the post (likes will be cascade deleted due to foreign key constraints)
        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync();
        
        return true;
    }
}