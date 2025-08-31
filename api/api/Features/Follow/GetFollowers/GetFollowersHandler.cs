using api.Data;
using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetFollowers;

public class GetFollowersHandler
{
    private readonly AppDbContext _context;

    public GetFollowersHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetFollowersQuery query)
    {
        // Get all users who are following the specified user
        var followerUsers = await _context.Follows
            .Where(f => f.Followee.UserName == query.Username)
            .Include(f => f.Follower)
            .Select(f => f.Follower)
            .ToListAsync();

        var userDtos = new List<UserDto>();
        foreach (var user in followerUsers)
        {
            var userDto = await user.ToDtoAsync(_context);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}