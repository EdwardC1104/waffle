using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Features.User;

namespace api.Features.Post.GetPopularFeed;

public class GetPopularFeedHandler
{
    private readonly AppDbContext _context;

    public GetPopularFeedHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PostDto>> Handle()
    {
        var posts = await _context.Posts
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
