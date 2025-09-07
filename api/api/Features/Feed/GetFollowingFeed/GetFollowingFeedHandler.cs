using api.Data;
using api.Features.Post;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetFollowingFeed;

public record GetFollowingFeedQuery(string UserId) : IRequest<IEnumerable<PostDto>>;

public class GetFollowingFeedHandler : IRequestHandler<GetFollowingFeedQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _context;

    public GetFollowingFeedHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PostDto>> Handle(GetFollowingFeedQuery request, CancellationToken cancellationToken)
    {
        var posts = await _context.Posts
            .Include(p => p.User)
            .Where(p => _context.Follows
                .Any(f => f.FollowerId == request.UserId && f.FolloweeId == p.UserId))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(_context, request.UserId);
            postDtos.Add(postDto);
        }

        return postDtos;
    }
}
