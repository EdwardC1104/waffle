using System.Security.Claims;
using api.Features.Post.CreatePost;
using api.Features.Post.DeletePost;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using api.Features.Post.UpdatePost;
using api.Features.Post.WordCount;
using api.Features.User;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Post;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
    private readonly GetPostsHandler _getPostsHandler;
    private readonly CreatePostHandler _createPost;
    private readonly UpdatePostHandler _updatePost;
    private readonly DeletePostHandler _deletePost;
    private readonly GetPostHandler _getPostHandler;
    private readonly TodaysWordCountHandler _todaysWordCountHandler;
    private readonly S3Service _s3Service;

    public PostController(GetPostsHandler getPostsHandler, CreatePostHandler createPost, UpdatePostHandler updatePost, DeletePostHandler deletePost, GetPostHandler getPostHandler, TodaysWordCountHandler todaysWordCountHandler, S3Service s3Service)
    {
        _getPostsHandler = getPostsHandler;
        _createPost = createPost;
        _updatePost = updatePost;
        _deletePost = deletePost;
        _getPostHandler = getPostHandler;
        _todaysWordCountHandler = todaysWordCountHandler;
        _s3Service = s3Service;
    }

    [HttpPost("/api/user/post/list")]
    public async Task<IActionResult> GetPosts([FromBody] GetPostsQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _getPostsHandler.Handle(query, userId);
        return Ok(response);
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostCommand command, [FromForm] IFormFile? coverImage)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        string? coverImageUrl = null;

        if (coverImage != null && coverImage.Length > 0)
        {
            coverImageUrl = await _s3Service.UploadImageAsync(coverImage);
        }

        var response = await _createPost.Handle(userId, command, coverImageUrl);
        return Created($"/api/post/get", response);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdatePost([FromForm] UpdatePostCommand command, [FromForm] IFormFile? coverImage)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        string? coverImageUrl = null;

        if (coverImage != null && coverImage.Length > 0)
        {
            coverImageUrl = await _s3Service.UploadImageAsync(coverImage);
        }

        var response = await _updatePost.Handle(userId, command, coverImageUrl);
        return Ok(response);
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetPost([FromBody] GetPostQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _getPostHandler.Handle(query, userId);
        return Ok(response);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeletePost([FromBody] DeletePostCommand request)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        await _deletePost.Handle(userId, request);
        return Ok(new { message = "Post deleted successfully" });
    }

    [HttpPost("count/today")]
    public async Task<IActionResult> GetTodaysWordCount()
    {
        var totalWordCount = await _todaysWordCountHandler.Handle();
        
        return Ok(totalWordCount);
    }
}