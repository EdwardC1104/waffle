using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post;

public class GetPost
{
    private readonly AppDbContext _dbContext;
    
    public GetPost(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public class Response
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public AuthorDto Author { get; set; } = new AuthorDto();
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
    
    public async Task<Response?> Handle(int postId)
    {
        // Get the specific post by ID
        var post = await _dbContext.Posts
            .Where(p => p.Id == postId)
            .Include(p => p.User)
            .Select(p => new Response
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                Author = new AuthorDto
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
