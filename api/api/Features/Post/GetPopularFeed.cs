using api.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Features.Post;

public class GetPopularFeed
{
    private readonly AppDbContext _context;

    public GetPopularFeed(AppDbContext context)
    {
        _context = context;
    }

    // DTO for post
    public class PostDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string AuthorId { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorUsername { get; set; } = string.Empty;
        public int PopularityScore { get; set; } // Could be based on likes, comments, shares, etc.
    }

    public class Response
    {
        public IEnumerable<PostDto> Posts { get; set; } = new List<PostDto>();
    }

    public async Task<Response> Handle()
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                AuthorId = p.UserId,
                AuthorName = p.User.Name,
                AuthorUsername = p.User.UserName ?? string.Empty,
                PopularityScore = 0 // For now, set to 0 - can be calculated later
            })
            .ToListAsync();

        return new Response { Posts = posts };
    }
}
