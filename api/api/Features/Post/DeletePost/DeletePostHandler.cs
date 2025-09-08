using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.DeletePost;

public class DeletePostHandler : IRequestHandler<DeletePostCommand>
{
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;
    
    public DeletePostHandler(AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == userId, cancellationToken);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {request.PostId} not found");
        }
        
        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}