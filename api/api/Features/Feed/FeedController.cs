using System.Security.Claims;
using api.Features.Feed.GetFollowingFeed;
using api.Features.Feed.GetFypFeed;
using api.Features.Feed.GetPopularFeed;
using api.Features.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Feed;

[ApiController]
[Route("api/feed")]
public class FeedController : ControllerBase
{
    private readonly GetFollowingFeedHandler _getFollowingFeedHandler;
    private readonly GetFypFeedHandler _getFypFeedHandler;
    private readonly GetPopularFeedHandler _getPopularFeedHandler;

    public FeedController(GetFollowingFeedHandler getFollowingFeedHandler, GetFypFeedHandler getFypFeedHandler, GetPopularFeedHandler getPopularFeedHandler)
    {
        _getFollowingFeedHandler = getFollowingFeedHandler;
        _getFypFeedHandler = getFypFeedHandler;
        _getPopularFeedHandler = getPopularFeedHandler;
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
        var posts = await _getFypFeedHandler.Handle(userId);
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
        var posts = await _getFollowingFeedHandler.Handle(userId);
        return Ok(posts);
    }

    [HttpPost("popular")]
    public async Task<IActionResult> GetPopularFeed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var posts = await _getPopularFeedHandler.Handle(userId);
        return Ok(posts);
    }
}