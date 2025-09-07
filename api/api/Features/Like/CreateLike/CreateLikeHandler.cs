using api.Data;
using api.Exceptions;
using api.Features.Post;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Like.CreateLike;

public class CreateLikeHandler : IRequestHandler<CreateLikeCommand, PostDto>
{
    private readonly AppDbContext _dbContext;

    public CreateLikeHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto> Handle(CreateLikeCommand command, CancellationToken cancellationToken)
    {
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == command.PostId, cancellationToken);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {command.PostId} not found");
        }
        
        var existingLike = await _dbContext.Likes
            .FirstOrDefaultAsync(l => l.UserId == command.UserId && l.PostId == post.Id, cancellationToken);
        
        if (existingLike != null)
        {
            throw new ApiException(409, $"Already liked post with id {command.PostId}");
        }
        
        var like = new api.Models.Like
        {
            UserId = command.UserId,
            PostId = post.Id,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Likes.Add(like);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Return the updated post with the user's like status
        return await post.ToDtoAsync(_dbContext, command.UserId);
    }
}