using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post;

public static class PostExtensions
{
    public static async Task<PostDto> ToDtoAsync(this Models.Post post, DbContext context, string? userId = null)
    {
        var likeCount = await context.Set<Models.Like>()
            .CountAsync(l => l.PostId == post.Id);
        
        var existingLike = userId != null && await context.Set<Models.Like>()
            .FirstOrDefaultAsync(l => l.User.Id == userId && l.PostId == post.Id) != null;
        
        return new PostDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            Author =  await post.User.ToDtoAsync(context),
            CoverImageUrl = string.IsNullOrEmpty(post.CoverImageUrl) ? "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop" : post.CoverImageUrl,
            LikeCount = likeCount,
            LikedByAuthenticatedUser = existingLike,
        };
    }
}