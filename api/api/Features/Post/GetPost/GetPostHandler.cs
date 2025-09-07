using api.Data;
using api.Exceptions;
using api.Features.User;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPost;

public class GetPostHandler : IRequestHandler<GetPostQuery, PostDto>
{
    private readonly AppDbContext _dbContext;
    
    public GetPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<PostDto> Handle(GetPostQuery query, CancellationToken cancellationToken)
    {
        // Fetch the post entity including the user
        var postEntity = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == query.PostId, cancellationToken);

        if (postEntity == null)
        {
            throw new ApiException(404, $"Post with id {query.PostId} not found");
        }

        // Map to DTO asynchronously
        var postDto = await postEntity.ToDtoAsync(_dbContext, query.AuthenticatedUserId);

        return postDto;
    }
}
