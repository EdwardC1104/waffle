using System.Security.Claims;
using api.Features.Follow.CreateFollow;
using api.Features.Follow.DeleteFollow;
using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
using api.Features.Like.CreateLike;
using api.Features.Like.DeleteLike;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Like;

[ApiController]
[Route("api/like")]
public class LikeController : ControllerBase
{
    private readonly CreateLikeHandler _createLikeHandler;
    private readonly DeleteLikeHandler _deleteLikeHandler;

    public LikeController(CreateLikeHandler createLikeHandler, DeleteLikeHandler deleteLikeHandler)
    {
        _createLikeHandler = createLikeHandler;
        _deleteLikeHandler = deleteLikeHandler;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Follow([FromBody] CreateLikeCommand command)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var result = await _createLikeHandler.Handle(userId, command);
        return Ok(result);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Unfollow([FromBody] DeleteLikeCommand command)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var result = await _deleteLikeHandler.Handle(userId, command);
        return Ok(result);
    }
}
