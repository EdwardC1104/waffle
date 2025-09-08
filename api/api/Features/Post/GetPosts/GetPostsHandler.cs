using api.Data;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPosts;

public class GetPostsHandler : IRequestHandler<GetPostsQuery, IEnumerable<PostDto>>
{
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;
    
    public GetPostsHandler(AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }
    
    public async Task<IEnumerable<PostDto>> Handle(GetPostsQuery query, CancellationToken cancellationToken)
    {
        var postsEntities = await _dbContext.Posts
            .Where(p => p.User.UserName == query.Username)
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        var userId = _currentUserService.GetUserIdOrNull();
        
        var posts = new List<PostDto>();
        foreach (var post in postsEntities)
        {
            posts.Add(await post.ToDtoAsync(_dbContext, userId));
        }

        return posts;
    }
}