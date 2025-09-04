using api.Data;
using api.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.DeleteFollow;

public class DeleteFollowHandler
{
    private readonly AppDbContext _context;

    public DeleteFollowHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task Handle(string userId, DeleteFollowCommand command)
    { 
        // Find the followee user by username
        var followeeUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == command.Following);
        
        if (followeeUser == null)
        {
            throw new ApiException(404, $"User with username {command.Following} not found");
        }

        // Find the existing follow relationship
        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == userId && f.FolloweeId == followeeUser.Id);
        
        if (existingFollow == null)
        {
            throw new ApiException(409, $"Not following user {command.Following}");
        }

        // Remove the follow relationship
        _context.Follows.Remove(existingFollow);
        await _context.SaveChangesAsync();
    }
}
