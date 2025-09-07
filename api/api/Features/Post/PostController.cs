using System.Security.Claims;
using api.Features.Post.CreatePost;
using api.Features.Post.DeletePost;
using api.Features.Post.GetPost;
using api.Features.Post.GetPosts;
using api.Features.Post.UpdatePost;
using api.Features.Post.WordCount;
using api.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Post;

[ApiController]
[Route("api/post")]
public class PostController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly S3Service _s3Service;

    public PostController(IMediator mediator, S3Service s3Service)
    {
        _mediator = mediator;
        _s3Service = s3Service;
    }

    [HttpPost("/api/user/post/list")]
    public async Task<IActionResult> GetPosts([FromBody] GetPostsQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        query.AuthenticatedUserId = userId;
        var response = await _mediator.Send(query);
        return Ok(response);
    }
    
    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreatePost([FromForm] CreatePostCommand command, [FromForm] IFormFile? coverImage)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }

        string? coverImageUrl = null;

        if (coverImage != null && coverImage.Length > 0)
        {
            coverImageUrl = await _s3Service.UploadImageAsync(coverImage);
        }

        command.UserId = userId;
        command.CoverImageUrl = coverImageUrl;
        var response = await _mediator.Send(command);
        return Created($"/api/post/get", response);
    }

    [Authorize]
    [HttpPost("update")]
    public async Task<IActionResult> UpdatePost([FromForm] UpdatePostCommand command, [FromForm] IFormFile? coverImage)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        string? coverImageUrl = null;

        if (coverImage != null && coverImage.Length > 0)
        {
            coverImageUrl = await _s3Service.UploadImageAsync(coverImage);
        }

        command.UserId = userId;
        command.CoverImageUrl = coverImageUrl;
        var response = await _mediator.Send(command);
        return Ok(response);
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetPost([FromBody] GetPostQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        query.AuthenticatedUserId = userId;
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> DeletePost([FromBody] DeletePostCommand request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }

        request.UserId = userId;
        await _mediator.Send(request);
        return Ok(new { message = "Post deleted successfully" });
    }

    [HttpPost("count/today")]
    public async Task<IActionResult> GetTodaysWordCount()
    {
        var totalWordCount = await _mediator.Send(new TodaysWordCountQuery());
        return Ok(totalWordCount);
    }
}