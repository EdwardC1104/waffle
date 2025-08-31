using Microsoft.EntityFrameworkCore;

namespace api.Features.User;

public static class UserExtensions
{
    public static async Task<UserDto> ToDtoAsync(this Models.User user, DbContext context)
    {
        var followerCount = await context.Set<Models.Follow>()
            .CountAsync(f => f.FolloweeId == user.Id);

        var followingCount = await context.Set<Models.Follow>()
            .CountAsync(f => f.FollowerId == user.Id);

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            FollowerCount = followerCount,
            FollowingCount = followingCount
        };
    }
}