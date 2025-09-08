using api.Data;
using api.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using api.Services;

namespace api.Features.Post.CreatePost;

public class CreatePostHandler : IRequestHandler<CreatePostCommand, PostDto>
{
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;
    
    public CreatePostHandler(AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        var newPost = new api.Models.Post
        {
            Title = request.Title,
            Content = request.Content,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            CoverImageUrl = request.CoverImageUrl ?? "",
            WordCount = request.Content.Split(new[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries).Length
        };
        
        _dbContext.Posts.Add(newPost);
        await _dbContext.SaveChangesAsync(cancellationToken);
        
        var postWithUser = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == newPost.Id, cancellationToken);

        if (postWithUser == null)
        {
            throw new ApiException(500, "Failed to create post");
        }
        
        return await postWithUser.ToDtoAsync(_dbContext, userId);
    }
}