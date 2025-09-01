using System.Security.Claims;
using api.Features.Post.CreatePost;
using api.Features.Post.DeletePost;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using api.Features.Post.UpdatePost;
using api.Features.Post.WordCount;
using api.Features.User;
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

    public PostController(GetPostsHandler getPostsHandler, CreatePostHandler createPost, UpdatePostHandler updatePost, DeletePostHandler deletePost, GetPostHandler getPostHandler, TodaysWordCountHandler todaysWordCountHandler)
    {
        _getPostsHandler = getPostsHandler;
        _createPost = createPost;
        _updatePost = updatePost;
        _deletePost = deletePost;
        _getPostHandler = getPostHandler;
        _todaysWordCountHandler = todaysWordCountHandler;
    }

    [HttpPost("/api/user/post/list")]
    public async Task<IActionResult> GetPosts([FromBody] GetPostsQuery query)
    {
        IEnumerable<PostDto> response;
        if (User.Identity is { IsAuthenticated: true, Name: not null })
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "Not logged in" });
            }
            
            response = await _getPostsHandler.Handle(userId, query);

        }
        else
        {
            response = await _getPostsHandler.Handle(query);
        }
        
        return Ok(response);
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostCommand request)
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

        var response = await _createPost.Handle(userId, request);
        
        if (response == null)
        {
            return NotFound(new { message = $"User with id '{userId}' not found" });
        }
        
        return Created($"/api/post/get", response);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdatePost([FromBody] UpdatePostCommand request)
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

        var response = await _updatePost.Handle(userId, request);
        
        if (response == null)
        {
            return NotFound(new { message = "Post not found or you don't have permission to edit it" });
        }
        
        return Ok(response);
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetPost([FromBody] GetPostQuery query)
    {
        PostDto? response = null;
        if (User.Identity is { IsAuthenticated: true, Name: not null })
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "Not logged in" });
            }
            response = await _getPostHandler.Handle(userId, query);
        }
        else
        {
            response = await _getPostHandler.Handle(query);
        }
        
        if (response == null)
        {
            return NotFound(new { message = $"Post with ID {query.PostId} not found" });
        }
        
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

        var success = await _deletePost.Handle(userId, request);
        
        if (success)
        {
            return Ok(new { message = "Post deleted successfully" });
        }
        
        return NotFound(new { message = "Post not found or you don't have permission to delete it" });
    }

    [HttpPost("count/today")]
    public async Task<IActionResult> GetTodaysWordCount()
    {
        var totalWordCount = await _todaysWordCountHandler.Handle();
        
        return Ok(totalWordCount);
    }
}