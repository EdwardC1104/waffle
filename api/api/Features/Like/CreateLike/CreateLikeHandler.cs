using api.Data;
using api.Features.Post;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Like.CreateLike;

public class CreateLikeHandler
{
    private readonly AppDbContext _dbContext;

    public CreateLikeHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto?> Handle(string username, CreateLikeQuery query)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
        
        if (user == null)
        {
            return null;
        }
        
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == query.PostId);
        
        if (post == null)
        {
            return null;
        }
        
        var existingLike = await _dbContext.Likes
            .FirstOrDefaultAsync(l => l.UserId == user.Id && l.PostId == post.Id);
        
        if (existingLike != null)
        {
            return null; // Already liked
        }
        
        var like = new api.Models.Like
        {
            UserId = user.Id,
            PostId = post.Id,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Likes.Add(like);
        await _dbContext.SaveChangesAsync();

        // Return the updated post with the user's like status
        return await post.ToDtoAsync(username, _dbContext);
    }
}