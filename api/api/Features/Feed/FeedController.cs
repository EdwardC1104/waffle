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
        var posts = await _mediator.Send(new GetFypFeedQuery());
        return Ok(posts);
    }
    
    [Authorize]
    [HttpPost("following")]
    public async Task<IActionResult> GetFollowingFeed()
    {
        var posts = await _mediator.Send(new GetFollowingFeedQuery());
        return Ok(posts);
    }

    [HttpPost("popular")]
    public async Task<IActionResult> GetPopularFeed()
    {
        var posts = await _mediator.Send(new GetPopularFeedQuery());
        return Ok(posts);
    }
}