using api.Data;
using System.Threading.Tasks;

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
        public string AuthorId { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorUsername { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
    }

    public class Response
    {
        public IEnumerable<PostDto> Posts { get; set; } = new List<PostDto>();
    }

    public async Task<Response> Handle(string username)
    {
        // TODO: Implement logic to get posts from users that the current user follows
        throw new NotImplementedException();
    }
}
