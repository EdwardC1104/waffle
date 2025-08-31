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
        var followedUsers = await _context.Follows
            .Where(f => f.Follower.UserName == query.Username)
            .Include(f => f.Followee)
            .Select(f => f.Followee)
            .ToListAsync();

        var userDtos = new List<UserDto>();
        foreach (var user in followedUsers)
        {
            var userDto = await user.ToDtoAsync(_context);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}
