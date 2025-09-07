using api.Data;
using api.Exceptions;
using api.Features.Post;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Like.DeleteLike;

public class DeleteLikeHandler
{
    private readonly AppDbContext _dbContext;

    public DeleteLikeHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto> Handle(string userId, DeleteLikeCommand command)
    {
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == command.PostId);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {command.PostId} not found");
        }
        
        var existingLike = await _dbContext.Likes
            .FirstOrDefaultAsync(l => l.UserId == userId && l.PostId == post.Id);
        
        if (existingLike == null)
        {
            throw new ApiException(409, $"Don't already like post with id {command.PostId}");
        }
        
        _dbContext.Likes.Remove(existingLike);
        await _dbContext.SaveChangesAsync();

        // Return the updated post with the user's like status
        return await post.ToDtoAsync(_dbContext, userId);
    }
}