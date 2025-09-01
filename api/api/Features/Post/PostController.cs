using System.Security.Claims;
using api.Features.Post.CreatePost;
using api.Features.Post.EditPost;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using api.Features.User;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Post;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
    private readonly GetPostsHandler _getPostsHandler;
    private readonly CreatePostHandler _createPost;
    private readonly EditPostHandler _editPost;
    private readonly GetPostHandler _getPostHandler;

    public PostController(GetPostsHandler getPostsHandler, CreatePostHandler createPost, EditPostHandler editPost, GetPostHandler getPostHandler)
    {
        _getPostsHandler = getPostsHandler;
        _createPost = createPost;
        _editPost = editPost;
        _getPostHandler = getPostHandler;
    }

    [HttpPost("/api/user/post/list")]
    public async Task<IActionResult> GetPosts([FromBody] GetPostsQuery query)
    {
        IEnumerable<PostDto> response;
        if (User.Identity is { IsAuthenticated: true, Name: not null })
        {
            response = await _getPostsHandler.Handle(User.Identity.Name, query);

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

        var response = await _createPost.Handle(User.Identity.Name, request);
        
        if (response == null)
        {
            return NotFound(new { message = $"User with username '{User.Identity.Name}' not found" });
        }
        
        return Created($"/api/post/get", response);
    }

    [HttpPost("edit")]
    public async Task<IActionResult> EditPost([FromBody] EditPostCommand request)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var response = await _editPost.Handle(User.Identity.Name, request);
        
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
            response = await _getPostHandler.Handle(User.Identity.Name, query);
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
}