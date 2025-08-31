using api.Data;
using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.GetPost;

public class GetPostHandler
{
    private readonly AppDbContext _dbContext;
    
    public GetPostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<PostDto?> Handle(GetPostQuery query)
    {
        // Fetch the post entity including the user
        var postEntity = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == query.PostId);

        if (postEntity == null) return null;

        // Map to DTO asynchronously
        var postDto = await postEntity.ToDtoAsync(_dbContext);

        return postDto;
    }
    
    public async Task<PostDto?> Handle(string username, GetPostQuery query)
    {
        // Fetch the post entity including the user
        var postEntity = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == query.PostId);

        if (postEntity == null) return null;

        // Map to DTO asynchronously
        var postDto = await postEntity.ToDtoAsync(username, _dbContext);

        return postDto;
    }
}
