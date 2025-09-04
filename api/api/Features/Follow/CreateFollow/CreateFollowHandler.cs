using api.Data;
using api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.CreateFollow;

public class CreateFollowHandler
{
    private readonly AppDbContext _context;

    public CreateFollowHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task Handle(string userId, CreateFollowCommand command)
    {
        var followeeUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == command.Following);
        
        if (followeeUser == null)
        {
            throw new ApiException(404, $"User with username {command.Following} not found");
        }

        // Check if the follow relationship already exists
        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == userId && f.FolloweeId == followeeUser.Id);
        
        if (existingFollow != null)
        {
            throw new ApiException(409, $"Already following user {command.Following}");
        }

        // Create new follow relationship
        var follow = new api.Models.Follow
        {
            FollowerId = userId,
            FolloweeId = followeeUser.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.Follows.Add(follow);
        await _context.SaveChangesAsync();
    }
}