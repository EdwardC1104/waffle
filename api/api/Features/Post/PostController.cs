using api.Features.Post.CreatePost;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Post;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
    private readonly GetPostsHandler _getPostsHandler;
    private readonly CreatePostHandler _createPost;
    private readonly GetPostHandler _getPostHandler;

    public PostController(GetPostsHandler getPostsHandler, CreatePostHandler createPost, GetPostHandler getPostHandler)
    {
        _getPostsHandler = getPostsHandler;
        _createPost = createPost;
        _getPostHandler = getPostHandler;
    }

    [HttpPost("/api/user/post/list")]
    public async Task<IActionResult> GetPosts([FromBody] GetPostsQuery query)
    {
        var response = await _getPostsHandler.Handle(query);
        return Ok(response);
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> CreatePost(string username, [FromBody] CreatePostCommand request)
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var authenticatedUsername = User.Identity?.Name;
        if (!string.Equals(authenticatedUsername, username, StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new { message = "Forbidden: You can only create posts for your own account" });
        }

        var response = await _createPost.Handle(request);
        
        if (response == null)
        {
            return NotFound(new { message = $"User with username '{username}' not found" });
        }
        
        return Created($"/api/user/{username}/post/{response.Id}", response);
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetPost([FromBody] GetPostQuery query)
    {
        var response = await _getPostHandler.Handle(query);
        
        if (response == null)
        {
            return NotFound(new { message = $"Post with ID {query.PostId} not found" });
        }
        
        return Ok(response);
    }
}