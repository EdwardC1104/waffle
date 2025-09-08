using api.Data;
using api.Features.Post;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetFypFeed;

public class GetFypFeedHandler : IRequestHandler<GetFypFeedQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public GetFypFeedHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<PostDto>> Handle(GetFypFeedQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        
        var posts = await _context.Posts
            .Include(p => p.User)
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
