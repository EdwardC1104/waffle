using api.Data;
using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPosts;

public class GetPostsHandler
{
    private readonly AppDbContext _dbContext;
    
    public GetPostsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<IEnumerable<PostDto>> Handle(string username)
    {
        // Get all posts for the user
        var posts = await _dbContext.Posts
            .Where(p => p.User.UserName == username)
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
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
            .ToListAsync();
            
        return posts;
    }
}