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

    public async Task<IEnumerable<UserDto>> Handle(string username)
    {
        // Get all users who are following the specified user
        var followers = await _context.Follows
            .Where(f => f.Followee.UserName == username)
            .Include(f => f.Follower)
            .Select(f => new UserDto
            {
                Id = f.Follower.Id,
                Name = f.Follower.Name,
                Username = f.Follower.UserName ?? string.Empty,
                Email = f.Follower.Email ?? string.Empty,
                ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            })
            .ToListAsync();

        return followers;
    }
}