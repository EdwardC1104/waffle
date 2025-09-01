using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.CreateFollow;

public class CreateFollowHandler
{
    private readonly AppDbContext _context;

    public CreateFollowHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(string userId, CreateFollowQuery query)
    {
        var followeeUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == query.Following);
        
        if (followeeUser == null)
        {
            return false; // Followee user not found
        }

        // Check if the follow relationship already exists
        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == userId && f.FolloweeId == followeeUser.Id);
        
        if (existingFollow != null)
        {
            return false; // Already following
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

        return true;
    }
}