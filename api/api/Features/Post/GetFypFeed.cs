using api.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Features.Post;

public class GetFypFeed
{
    private readonly AppDbContext _context;

    public GetFypFeed(AppDbContext context)
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
    }

    public class Response
    {
        public IEnumerable<PostDto> Posts { get; set; } = new List<PostDto>();
    }

    public async Task<Response> Handle(string username)
    {
        // TODO: Implement "For You Page" algorithm to personalize posts for the user
        throw new NotImplementedException();
    }
}
