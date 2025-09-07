using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.CreateFollow;

public class CreateFollowHandler : IRequestHandler<CreateFollowCommand>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public CreateFollowHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(CreateFollowCommand command, CancellationToken cancellationToken)
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
        
        if (existingFollow != null)
        {
            throw new ApiException(409, $"Already following user {command.Following}");
        }

        var follow = new api.Models.Follow
        {
            FollowerId = userId,
            FolloweeId = followeeUser.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.Follows.Add(follow);
        await _context.SaveChangesAsync(cancellationToken);
    }
}