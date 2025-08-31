using api.Data;
using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetFollowing;

public class GetFollowingHandler
{
    private readonly AppDbContext _context;

    public GetFollowingHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetFollowingQuery query)
    {
        // Get all users who the specified user is following
        var following = await _context.Follows
            .Where(f => f.Follower.UserName == query.Username)
            .Include(f => f.Followee)
            .Select(f => new UserDto
            {
                Id = f.Followee.Id,
                Name = f.Followee.Name,
                Username = f.Followee.UserName ?? string.Empty,
                Email = f.Followee.Email ?? string.Empty,
                ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            })
            .ToListAsync();

        return following;
    }
}
