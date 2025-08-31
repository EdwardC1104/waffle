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
    public async Task<IActionResult> Follow([FromBody] CreateLikeQuery query)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var success = await _createLikeHandler.Handle(User.Identity.Name, query);
        
        if (success)
        {
            return Ok(new { message = "Successfully liked post" });
        }

        return BadRequest(new { message = "Unable to like post. User may not exist or you may already like the post." });
    }

    [HttpPost("delete")]
    public async Task<IActionResult> Unfollow([FromBody] DeleteLikeCommand command)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        var success = await _deleteLikeHandler.Handle(User.Identity.Name, command);
        
        if (success)
        {
            return Ok(new { message = "Successfully unliked post" });
        }

        return BadRequest(new { message = "Unable to unlike post. User may not exist or you may not already like the post." });
    }
}
