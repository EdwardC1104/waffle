using Microsoft.EntityFrameworkCore;

namespace api.Features.User;

public static class UserExtensions
{
    public static async Task<UserDto> ToDtoAsync(this Models.User user, DbContext context, string? userId = null)
    {
        var followerCount = await context.Set<Models.Follow>()
            .CountAsync(f => f.FolloweeId == user.Id);

        var followingCount = await context.Set<Models.Follow>()
            .CountAsync(f => f.FollowerId == user.Id);

        var totalWordCount = await context.Set<Models.Post>()
            .Where(p => p.UserId == user.Id)
            .SumAsync(p => p.WordCount);
        
        var followedByAuthenticatedUser = userId != null && await context.Set<Models.Follow>()
            .FirstOrDefaultAsync(f => f.FollowerId == userId && f.FolloweeId == user.Id) != null;

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            ProfilePictureUrl = user.ProfilePictureUrl,
            FollowerCount = followerCount,
            FollowingCount = followingCount,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            WordCount = totalWordCount,
            FollowedByAuthenticatedUser = followedByAuthenticatedUser
        };
    }
}