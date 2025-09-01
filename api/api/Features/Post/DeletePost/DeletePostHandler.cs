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

    public async Task<bool> Handle(string username, DeletePostCommand request)
    {
        // First check if the user exists
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
            
        if (user == null)
        {
            return false;
        }
        
        // Find the post and verify ownership
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == user.Id);
        
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