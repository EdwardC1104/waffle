using api.Data;
using api.Features.Post;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Feed.GetFypFeed;

public record GetFypFeedQuery(string UserId) : IRequest<IEnumerable<PostDto>>;

public class GetFypFeedHandler : IRequestHandler<GetFypFeedQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _context;

    public GetFypFeedHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PostDto>> Handle(GetFypFeedQuery request, CancellationToken cancellationToken)
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
