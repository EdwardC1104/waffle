using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Like.CreateLike;

public class CreateLikeHandler
{
    private readonly AppDbContext _dbContext;

    public CreateLikeHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(string username, CreateLikeQuery query)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
        
        if (user == null)
        {
            return false;
        }
        
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == query.PostId);
        
        if (post == null)
        {
            return false;
        }
        
        var existingLike = await _dbContext.Likes
            .FirstOrDefaultAsync(l => l.UserId == user.Id && l.PostId == post.Id);
        
        if (existingLike != null)
        {
            return false;
        }
        
        var like = new api.Models.Like
        {
            UserId = user.Id,
            PostId = post.Id,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Likes.Add(like);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}