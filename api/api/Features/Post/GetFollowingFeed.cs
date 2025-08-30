using api.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post;

public class GetFollowingFeed
{
    private readonly AppDbContext _context;

    public GetFollowingFeed(AppDbContext context)
    {
        _context = context;
    }

    // DTO for post
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public GetPopularFeed.AuthorDto Author { get; set; } = new GetPopularFeed.AuthorDto();
        public string CoverImageUrl { get; set; } = string.Empty;
    }

    public class AuthorDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }

    public class Response
    {
        public IEnumerable<GetPopularFeed.PostDto> Posts { get; set; } = new List<GetPopularFeed.PostDto>();
    }

    public async Task<GetPopularFeed.Response> Handle(string username)
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new GetPopularFeed.PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                Author = new GetPopularFeed.AuthorDto
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

        return new GetPopularFeed.Response { Posts = posts };
    }
}
