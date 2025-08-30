using Microsoft.AspNetCore.Mvc;

namespace api.Features.Post;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
    private readonly GetPosts _getPosts;
    private readonly CreatePost _createPost;
    private readonly GetPost _getPost;
    private readonly GetFollowingFeed _getFollowingFeed;
    private readonly GetFypFeed _getFypFeed;
    private readonly GetPopularFeed _getPopularFeed;

    public PostController(GetPosts getPosts, CreatePost createPost, GetPost getPost, GetFollowingFeed getFollowingFeed, GetFypFeed getFypFeed, GetPopularFeed getPopularFeed)
    {
        _getPosts = getPosts;
        _createPost = createPost;
        _getPost = getPost;
        _getFollowingFeed = getFollowingFeed;
        _getFypFeed = getFypFeed;
        _getPopularFeed = getPopularFeed;
    }

    [HttpGet("/api/user/{username}/post")]
    public async Task<IActionResult> GetPosts(string username)
    {
        var response = await _getPosts.Handle(username);
        return Ok(response);
    }
    
    [HttpPost("/api/user/{username}/post")]
    public async Task<IActionResult> CreatePost(string username, [FromBody] CreatePost.Request request)
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
        var response = await _getPost.Handle(id);
        
        if (response == null)
        {
            return NotFound($"Post with ID {id} not found");
        }
        
        return Ok(response);
    }

    [HttpGet("/api/user/{username}/feed/following")]
    public async Task<IActionResult> GetFollowingFeed(string username)
    {
        var posts = await _getFollowingFeed.Handle(username);
        return Ok(posts);
    }

    [HttpGet("/api/user/{username}/feed/fyp")]
    public async Task<IActionResult> GetFypFeed(string username)
    {
        var posts = await _getFypFeed.Handle(username);
        return Ok(posts);
    }

    [HttpGet("/api/feed/popular")]
    public async Task<IActionResult> GetPopularFeed()
    {
        var posts = await _getPopularFeed.Handle();
        return Ok(posts);
    }
}