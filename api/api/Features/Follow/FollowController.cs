using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Follow;

[ApiController]
[Route("api/user")]
public class FollowController : ControllerBase
{
    private readonly GetSuggestionsHandler _getSuggestionsHandler;
    private readonly GetFollowersHandler _getFollowersHandler;
    private readonly GetFollowingHandler _getFollowingHandler;

    public FollowController(GetSuggestionsHandler getSuggestionsHandler, GetFollowersHandler getFollowersHandler, GetFollowingHandler getFollowingHandler)
    {
        _getSuggestionsHandler = getSuggestionsHandler;
        _getFollowersHandler = getFollowersHandler;
        _getFollowingHandler = getFollowingHandler;
    }

    [HttpGet("{username}/follow/suggestions")]
    public async Task<IActionResult> GetSuggestions(string username)
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

        var response = await _getSuggestionsHandler.Handle(username);
        return Ok(response);
    }

    [HttpGet("{username}/followers")]
    public async Task<IActionResult> GetFollowers(string username)
    {
        var response = await _getFollowersHandler.Handle(username);
        return Ok(response);
    }

    [HttpGet("{username}/following")]
    public async Task<IActionResult> GetFollowing(string username)
    {
        var response = await _getFollowingHandler.Handle(username);
        return Ok(response);
    }
}
