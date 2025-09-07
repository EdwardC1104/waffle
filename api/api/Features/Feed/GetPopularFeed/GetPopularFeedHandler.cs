using api.Data;
using api.Features.Post;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetPopularFeed;

public record GetPopularFeedQuery(string? UserId) : IRequest<IEnumerable<PostDto>>;

public class GetPopularFeedHandler : IRequestHandler<GetPopularFeedQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _context;

    public GetPopularFeedHandler(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<PostDto>> Handle(GetPopularFeedQuery request, CancellationToken cancellationToken)
    {
        var posts = await _context.Posts
            .Include(p => p.User)
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
