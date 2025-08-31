using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.DeleteFollow;

public class DeleteFollowHandler
{
    private readonly AppDbContext _context;

    public DeleteFollowHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteFollowQuery query)
    {
        // Find the follower user by username
        var followerUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == query.Follower);
        
        if (followerUser == null)
        {
            return false; // Follower user not found
        }

        // Find the followee user by username
        var followeeUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == query.Following);
        
        if (followeeUser == null)
        {
            return false; // Followee user not found
        }

        // Find the existing follow relationship
        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == followerUser.Id && f.FolloweeId == followeeUser.Id);
        
        if (existingFollow == null)
        {
            return false; // Follow relationship doesn't exist
        }

        // Remove the follow relationship
        _context.Follows.Remove(existingFollow);
        await _context.SaveChangesAsync();

        return true;
    }
}
