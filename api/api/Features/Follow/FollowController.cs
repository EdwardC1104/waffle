using Microsoft.AspNetCore.Mvc;

namespace api.Features.Follow;

[ApiController]
[Route("api/user")]
public class FollowController : ControllerBase
{
    private readonly GetSuggestions _getSuggestions;

    public FollowController(GetSuggestions getSuggestions)
    {
        _getSuggestions = getSuggestions;
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

        var response = await _getSuggestions.Handle(username);
        return Ok(response);
    }
}