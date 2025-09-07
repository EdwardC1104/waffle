using System.Security.Claims;
using api.Features.Follow.CreateFollow;
using api.Features.Follow.DeleteFollow;
using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Follow;

[ApiController]
[Route("api/follow")]
public class FollowController : ControllerBase
{
    private readonly GetSuggestionsHandler _getSuggestionsHandler;
    private readonly GetFollowersHandler _getFollowersHandler;
    private readonly GetFollowingHandler _getFollowingHandler;
    private readonly CreateFollowHandler _createFollowHandler;
    private readonly DeleteFollowHandler _deleteFollowHandler;

    public FollowController(GetSuggestionsHandler getSuggestionsHandler, GetFollowersHandler getFollowersHandler, GetFollowingHandler getFollowingHandler, CreateFollowHandler createFollowHandler, DeleteFollowHandler deleteFollowHandler)
    {
        _getSuggestionsHandler = getSuggestionsHandler;
        _getFollowersHandler = getFollowersHandler;
        _getFollowingHandler = getFollowingHandler;
        _createFollowHandler = createFollowHandler;
        _deleteFollowHandler = deleteFollowHandler;
    }

    [HttpPost("suggestions")]
    public async Task<IActionResult> GetSuggestions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _getSuggestionsHandler.Handle(userId);
        return Ok(response);
    }

    [HttpPost("followers")]
    public async Task<IActionResult> GetFollowers([FromBody] GetFollowersQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _getFollowersHandler.Handle(query, userId);
        return Ok(response);
    }

    [HttpPost("following")]
    public async Task<IActionResult> GetFollowing([FromBody] GetFollowingQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _getFollowingHandler.Handle(query, userId);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Follow([FromBody] CreateFollowCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        await _createFollowHandler.Handle(userId, command);
        return Ok(new { message = "Successfully followed user" });
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> Unfollow([FromBody] DeleteFollowCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        await _deleteFollowHandler.Handle(userId, command);
        return Ok(new { message = "Successfully unfollowed user" });
    }
}
