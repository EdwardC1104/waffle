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
    public async Task<IActionResult> GetSuggestions()
    {
        if (User.Identity is { IsAuthenticated: true, Name: not null })
        {
            var response = await _getSuggestionsHandler.Handle(User.Identity.Name);
            return Ok(response);
        }
        else
        {
            var response = await _getSuggestionsHandler.Handle();
            return Ok(response);
        }
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
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var success = await _createFollowHandler.Handle(User.Identity.Name, query);
        
        if (success)
        {
            return Ok(new { message = "Successfully followed user" });
        }

        return BadRequest(new { message = "Unable to follow user. User may not exist or you may already be following them." });
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Unfollow([FromBody] DeleteFollowQuery query)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var success = await _deleteFollowHandler.Handle(User.Identity.Name, query);
        
        if (success)
        {
            return Ok(new { message = "Successfully unfollowed user" });
        }

        return BadRequest(new { message = "Unable to unfollow user. User may not exist or you may not be following them." });
    }
}
