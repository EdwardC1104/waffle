using api.Features.Follow.CreateFollow;
using api.Features.Follow.DeleteFollow;
using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
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
    public async Task<IActionResult> GetSuggestions([FromBody] GetSuggestionsQuery query)
    {
        // Ensure the user is authenticated
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        // Check if the authenticated user's username matches the route username
        var authenticatedUsername = User.Identity?.Name;
        if (!string.Equals(authenticatedUsername, query.Username, StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new { message = "Forbidden: You can only get suggestions for your own account" });
        }

        var response = await _getSuggestionsHandler.Handle(query);
        return Ok(response);
    }

    [HttpPost("followers")]
    public async Task<IActionResult> GetFollowers([FromBody] GetFollowersQuery query)
    {
        var response = await _getFollowersHandler.Handle(query);
        return Ok(response);
    }

    [HttpPost("following")]
    public async Task<IActionResult> GetFollowing([FromBody] GetFollowingQuery query)
    {
        var response = await _getFollowingHandler.Handle(query);
        return Ok(response);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Follow([FromBody] CreateFollowQuery query)
    {
        // Ensure the user is authenticated
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        // Check if the authenticated user's username matches the follower username
        var authenticatedUsername = User.Identity?.Name;
        if (!string.Equals(authenticatedUsername, query.Follower, StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new { message = "Forbidden: You can only create follows for your own account" });
        }

        var success = await _createFollowHandler.Handle(query);
        
        if (success)
        {
            return Ok(new { message = "Successfully followed user" });
        }
        else
        {
            return BadRequest(new { message = "Unable to follow user. User may not exist or you may already be following them." });
        }
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Unfollow([FromBody] DeleteFollowQuery query)
    {
        // Ensure the user is authenticated
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        // Check if the authenticated user's username matches the follower username
        var authenticatedUsername = User.Identity?.Name;
        if (!string.Equals(authenticatedUsername, query.Follower, StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new { message = "Forbidden: You can only delete follows for your own account" });
        }

        var success = await _deleteFollowHandler.Handle(query);
        
        if (success)
        {
            return Ok(new { message = "Successfully unfollowed user" });
        }
        else
        {
            return BadRequest(new { message = "Unable to unfollow user. User may not exist or you may not be following them." });
        }
    }
}
