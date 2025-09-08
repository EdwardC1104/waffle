using api.Data;
using api.Exceptions;
using api.Features.User;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPost;

public class GetPostHandler : IRequestHandler<GetPostQuery, PostDto>
{
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;
    
    public GetPostHandler(AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }
    
    public async Task<PostDto> Handle(GetPostQuery query, CancellationToken cancellationToken)
    {
        var postEntity = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == query.PostId, cancellationToken);

        if (postEntity == null)
        {
            throw new ApiException(404, $"Post with id {query.PostId} not found");
        }

        var userId = _currentUserService.GetUserIdOrNull();

        var postDto = await postEntity.ToDtoAsync(_dbContext, userId);

        return postDto;
    }
}
