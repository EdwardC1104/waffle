using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.DeleteFollow;

public class DeleteFollowHandler : IRequestHandler<DeleteFollowCommand>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public DeleteFollowHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteFollowCommand command, CancellationToken cancellationToken)
    { 
        var userId = _currentUserService.GetRequiredUserId();
        
        var followeeUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == command.Following, cancellationToken);
        
        if (followeeUser == null)
        {
            throw new ApiException(404, $"User with username {command.Following} not found");
        }

        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == userId && f.FolloweeId == followeeUser.Id, cancellationToken);
        
        if (existingFollow == null)
        {
            throw new ApiException(409, $"Not following user {command.Following}");
        }

        _context.Follows.Remove(existingFollow);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
