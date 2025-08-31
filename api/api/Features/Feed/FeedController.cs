using api.Features.Feed.GetFollowingFeed;
using api.Features.Feed.GetFypFeed;
using api.Features.Feed.GetPopularFeed;
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

    [HttpPost("fyp")]
    public async Task<IActionResult> GetFypFeed([FromBody] GetFypFeedQuery query)
    {
        var posts = await _getFypFeedHandler.Handle(query);
        return Ok(posts);
    }
    
    [HttpPost("following")]
    public async Task<IActionResult> GetFollowingFeed([FromBody] GetFollowingFeedQuery query)
    {
        var posts = await _getFollowingFeedHandler.Handle(query);
        return Ok(posts);
    }

    [HttpPost("popular")]
    public async Task<IActionResult> GetPopularFeed()
    {
        var posts = await _getPopularFeedHandler.Handle();
        return Ok(posts);
    }
}