using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post;

public class GetPosts
{
    private readonly AppDbContext _dbContext;
    
    public GetPosts(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public class Response
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorUsername { get; set; } = string.Empty;
    }
    
    public async Task<List<Response>?> Handle(string username)
    {
        // First check if the user exists
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
            
        if (user == null)
        {
            return null;
        }
        
        // Get all posts for the user
        var posts = await _dbContext.Posts
            .Where(p => p.UserId == user.Id)
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new Response
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                AuthorName = p.User.Name,
                AuthorUsername = p.User.UserName ?? string.Empty
            })
            .ToListAsync();
            
        return posts;
    }
}