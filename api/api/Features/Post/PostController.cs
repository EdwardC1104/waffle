using Microsoft.AspNetCore.Mvc;

namespace api.Features.Post;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
    private readonly GetPosts _getPosts;
    private readonly CreatePost _createPost;
    private readonly GetPost _getPost;

    public PostController(GetPosts getPosts, CreatePost createPost, GetPost getPost)
    {
        _getPosts = getPosts;
        _createPost = createPost;
        _getPost = getPost;
    }

    [HttpGet("/api/user/{username}/post")]
    public async Task<IActionResult> GetPosts(string username)
    {
        var response = await _getPosts.Handle(username);
        
        if (response == null)
        {
            return NotFound($"User with username '{username}' not found");
        }
        
        return Ok(response);
    }
    
    [HttpPost("/api/user/{username}/post")]
    public async Task<IActionResult> CreatePost(string username, [FromBody] CreatePost.Request request)
    {
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
}