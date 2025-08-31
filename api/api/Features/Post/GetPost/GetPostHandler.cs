using api.Data;
using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPost;

public class GetPostHandler
{
    private readonly AppDbContext _dbContext;
    
    public GetPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<PostDto?> Handle(int postId)
    {
        // Get the specific post by ID
        var post = await _dbContext.Posts
            .Where(p => p.Id == postId)
            .Include(p => p.User)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                Author = new UserDto
                {
                    Id = p.User.Id,
                    Name = p.User.Name,
                    Username = p.User.UserName ?? string.Empty,
                    Email = p.User.Email ?? string.Empty,
                    ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                },
                CoverImageUrl = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop"
            })
            .FirstOrDefaultAsync();
            
        return post;
    }
}
