using api.Data;
using api.Features.Post;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetFollowingFeed;

public class GetFollowingFeedHandler : IRequestHandler<GetFollowingFeedQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public GetFollowingFeedHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<PostDto>> Handle(GetFollowingFeedQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        
        var posts = await _context.Posts
            .Include(p => p.User)
            .Where(p => _context.Follows
                .Any(f => f.FollowerId == userId && f.FolloweeId == p.UserId))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(_context, userId);
            postDtos.Add(postDto);
        }

        return postDtos;
    }
}
