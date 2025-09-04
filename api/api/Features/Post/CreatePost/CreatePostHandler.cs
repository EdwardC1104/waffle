using api.Data;
using api.Exceptions;
using Microsoft.EntityFrameworkCore;
using api.Features.User;

namespace api.Features.Post.CreatePost;

public class CreatePostHandler
{
    private readonly AppDbContext _dbContext;
    
    public CreatePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto> Handle(string userId, CreatePostCommand request, string? coverImageUrl = null)
    {
        var newPost = new api.Models.Post
        {
            Title = request.Title,
            Content = request.Content,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            CoverImageUrl = coverImageUrl ?? "",
            WordCount = request.Content.Split(new char[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries).Length
        };
        
        _dbContext.Posts.Add(newPost);
        await _dbContext.SaveChangesAsync();
        
        // Load the post with the User navigation property included
        var postWithUser = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == newPost.Id);

        if (postWithUser == null)
        {
            throw new ApiException(500, "Failed to create post");
        };
        
        // Return the created post with author information
        return await postWithUser.ToDtoAsync(userId, _dbContext);
    }
}