using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Like.DeleteLike;

public class DeleteLikeHandler
{
    private readonly AppDbContext _dbContext;

    public DeleteLikeHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(string username, DeleteLikeCommand command)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
        
        if (user == null)
        {
            return false;
        }
        
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == command.PostId);
        
        if (post == null)
        {
            return false;
        }
        
        var existingLike = await _dbContext.Likes
            .FirstOrDefaultAsync(l => l.UserId == user.Id && l.PostId == post.Id);
        
        if (existingLike == null)
        {
            return false;
        }
        
        _dbContext.Likes.Remove(existingLike);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}