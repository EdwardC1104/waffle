using api.Data;
using api.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.DeletePost;

public class DeletePostHandler : IRequestHandler<DeletePostCommand>
{
    private readonly AppDbContext _dbContext;
    
    public DeletePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == request.UserId, cancellationToken);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {request.PostId} not found");
        }
        
        // Delete the post (likes will be cascade deleted due to foreign key constraints)
        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}