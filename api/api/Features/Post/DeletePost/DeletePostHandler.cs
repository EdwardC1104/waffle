using api.Data;
using api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.DeletePost;

public class DeletePostHandler
{
    private readonly AppDbContext _dbContext;
    
    public DeletePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(string userId, DeletePostCommand request)
    {
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == userId);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {request.PostId} not found");
        }
        
        // Delete the post (likes will be cascade deleted due to foreign key constraints)
        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync();
    }
}