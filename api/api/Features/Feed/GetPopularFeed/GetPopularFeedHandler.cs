using api.Data;
using api.Features.Post;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetPopularFeed;

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
            .ToListAsync();

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(_context);
            postDtos.Add(postDto);
        }

        return postDtos;
    }
    
    public async Task<IEnumerable<PostDto>> Handle(string userId)
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(userId, _context);
            postDtos.Add(postDto);
        }

        return postDtos;
    }
}
