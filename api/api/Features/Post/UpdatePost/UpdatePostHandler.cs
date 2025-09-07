using api.Data;
using api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.UpdatePost;

public class UpdatePostHandler
{
    private readonly AppDbContext _dbContext;
    
    public UpdatePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto> Handle(string userId, UpdatePostCommand request, string? coverImageUrl = null)
    {
        // Find the post and verify ownership
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == userId);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {request.PostId} not found");
        }
        
        // Update only the fields that are provided
        if (!string.IsNullOrEmpty(request.Title))
        {
            post.Title = request.Title;
        }
        
        if (!string.IsNullOrEmpty(request.Content))
        {
            post.Content = request.Content;
            post.WordCount = post.Content.Split(new char[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Length;
        }
        
        post.CoverImageUrl = coverImageUrl ?? "";
        
        // Update the modification timestamp
        post.UpdatedAt = DateTime.UtcNow;
        
        await _dbContext.SaveChangesAsync();
        
        // Return the updated post
        return await post.ToDtoAsync(_dbContext, userId);
    }
}