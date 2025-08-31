using api.Features.Post.CreatePost;
using api.Features.Post.GetFollowingFeed;
using api.Features.Post.GetFypFeed;
using api.Features.Post.GetPopularFeed;
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
    private readonly GetFollowingFeedHandler _getFollowingFeedHandler;
    private readonly GetFypFeedHandler _getFypFeedHandler;
    private readonly GetPopularFeedHandler _getPopularFeedHandler;

    public PostController(GetPostsHandler getPostsHandler, CreatePostHandler createPost, GetPostHandler getPostHandler, GetFollowingFeedHandler getFollowingFeedHandler, GetFypFeedHandler getFypFeedHandler, GetPopularFeedHandler getPopularFeedHandler)
    {
        _getPostsHandler = getPostsHandler;
        _createPost = createPost;
        _getPostHandler = getPostHandler;
        _getFollowingFeedHandler = getFollowingFeedHandler;
        _getFypFeedHandler = getFypFeedHandler;
        _getPopularFeedHandler = getPopularFeedHandler;
    }

    [HttpGet("/api/user/{username}/post")]
    public async Task<IActionResult> GetPosts(string username)
    {
        var response = await _getPostsHandler.Handle(username);
        return Ok(response);
    }
    
    [HttpPost("/api/user/{username}/post")]
    public async Task<IActionResult> CreatePost(string username, [FromBody] CreatePostCommand request)
    {
        // Ensure the user is authenticated
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized();
        }

        // Check if the authenticated user's username matches the route username
        var authenticatedUsername = User.Identity?.Name;
        if (!string.Equals(authenticatedUsername, username, StringComparison.OrdinalIgnoreCase))
        {
            return Forbid();
        }

        // Check model validation
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var response = await _createPost.Handle(request, username);
        
        if (response == null)
        {
            return NotFound($"User with username '{username}' not found");
        }
        
        return Created($"/api/user/{username}/post/{response.Id}", response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetPost(int id)
    {
        var response = await _getPostHandler.Handle(id);
        
        if (response == null)
        {
            return NotFound($"Post with ID {id} not found");
        }
        
        return Ok(response);
    }

    [HttpGet("/api/user/{username}/feed/following")]
    public async Task<IActionResult> GetFollowingFeed(string username)
    {
        var posts = await _getFollowingFeedHandler.Handle(username);
        return Ok(posts);
    }

    [HttpGet("/api/user/{username}/feed/fyp")]
    public async Task<IActionResult> GetFypFeed(string username)
    {
        var posts = await _getFypFeedHandler.Handle(username);
        return Ok(posts);
    }

    [HttpGet("/api/feed/popular")]
    public async Task<IActionResult> GetPopularFeed()
    {
        var posts = await _getPopularFeedHandler.Handle();
        return Ok(posts);
    }
}