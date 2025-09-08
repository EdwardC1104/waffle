using api.Data;
using api.Features.Post;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetPopularFeed;

public class GetPopularFeedHandler : IRequestHandler<GetPopularFeedQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public GetPopularFeedHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }
    
    public async Task<IEnumerable<PostDto>> Handle(GetPopularFeedQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetUserIdOrNull();
        
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
