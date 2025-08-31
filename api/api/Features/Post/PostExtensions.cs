using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post;

public static class PostExtensions
{
public static async Task<PostDto> ToDtoAsync(this Models.Post post, DbContext context)
    {
        return new PostDto
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Author =  await post.User.ToDtoAsync(context),
            CoverImageUrl = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop"
        };
    }
    
}