using api.Data;
using api.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using api.Features.User;

namespace api.Features.Post.CreatePost;

public class CreatePostHandler : IRequestHandler<CreatePostCommand, PostDto>
{
    private readonly AppDbContext _dbContext;
    
    public CreatePostHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var newPost = new api.Models.Post
        {
            Title = request.Title,
            Content = request.Content,
            UserId = request.UserId,
            CreatedAt = DateTime.UtcNow,
            CoverImageUrl = request.CoverImageUrl ?? "",
            WordCount = request.Content.Split(new char[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries).Length
        };
        
        _dbContext.Posts.Add(newPost);
        await _dbContext.SaveChangesAsync(cancellationToken);
        
        // Load the post with the User navigation property included
        var postWithUser = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == newPost.Id, cancellationToken);

        if (postWithUser == null)
        {
            throw new ApiException(500, "Failed to create post");
        }
        
        // Return the created post with author information
        return await postWithUser.ToDtoAsync(_dbContext, request.UserId);
    }
}