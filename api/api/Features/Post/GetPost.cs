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
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorUsername { get; set; } = string.Empty;
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
                AuthorName = p.User.Name,
                AuthorUsername = p.User.UserName ?? string.Empty
            })
            .FirstOrDefaultAsync();
            
        return post;
    }
}
