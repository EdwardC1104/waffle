using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.UpdatePost;

public class UpdatePostHandler : IRequestHandler<UpdatePostCommand, PostDto>
{
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;
    
    public UpdatePostHandler(AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<PostDto> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == request.PostId && p.UserId == userId, cancellationToken);
        
        if (post == null)
        {
            throw new ApiException(404, $"Post with id {request.PostId} not found");
        }
        
        if (!string.IsNullOrEmpty(request.Title))
        {
            post.Title = request.Title;
        }
        
        if (!string.IsNullOrEmpty(request.Content))
        {
            post.Content = request.Content;
            post.WordCount = post.Content.Split(new char[] { ' ', '\t', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Length;
        }

        if (request.DeleteCoverImage)
        {
            post.CoverImageUrl = "";
        } else if (!string.IsNullOrEmpty(request.CoverImageUrl))
        {
            post.CoverImageUrl = request.CoverImageUrl;
        }
        
        post.UpdatedAt = DateTime.UtcNow;
        
        await _dbContext.SaveChangesAsync(cancellationToken);
        
        return await post.ToDtoAsync(_dbContext, userId);
    }
}