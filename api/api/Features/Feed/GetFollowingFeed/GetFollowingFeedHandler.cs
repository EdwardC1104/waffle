using api.Data;
using api.Features.Post;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetFollowingFeed;

public class GetFollowingFeedHandler
{
    private readonly AppDbContext _context;

    public GetFollowingFeedHandler(AppDbContext context)
    {
        _context = context;
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
