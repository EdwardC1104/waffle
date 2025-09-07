using System.Security.Claims;
using api.Features.Feed.GetFollowingFeed;
using api.Features.Feed.GetFypFeed;
using api.Features.Feed.GetPopularFeed;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Feed;

[ApiController]
[Route("api/feed")]
public class FeedController : ControllerBase
{
    private readonly IMediator _mediator;

    public FeedController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpPost("fyp")]
    public async Task<IActionResult> GetFypFeed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        var posts = await _mediator.Send(new GetFypFeedQuery(userId));
        return Ok(posts);
    }
    
    [Authorize]
    [HttpPost("following")]
    public async Task<IActionResult> GetFollowingFeed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        var posts = await _mediator.Send(new GetFollowingFeedQuery(userId));
        return Ok(posts);
    }

    [HttpPost("popular")]
    public async Task<IActionResult> GetPopularFeed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var posts = await _mediator.Send(new GetPopularFeedQuery(userId));
        return Ok(posts);
    }
}