using api.Data;
using api.Features.User;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPosts;

public class GetPostsHandler : IRequestHandler<GetPostsQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _dbContext;
    
    public GetPostsHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<IEnumerable<PostDto>> Handle(GetPostsQuery query, CancellationToken cancellationToken)
    {
        // Fetch posts including user
        var postsEntities = await _dbContext.Posts
            .Where(p => p.User.UserName == query.Username)
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        // Map to DTOs asynchronously
        var posts = new List<PostDto>();
        foreach (var post in postsEntities)
        {
            posts.Add(await post.ToDtoAsync(_dbContext, query.AuthenticatedUserId));
        }

        return posts;
    }
}