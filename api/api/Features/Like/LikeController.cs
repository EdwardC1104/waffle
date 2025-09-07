using System.Security.Claims;
using api.Features.Like.CreateLike;
using api.Features.Like.DeleteLike;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Like;

[ApiController]
[Route("api/like")]
public class LikeController : ControllerBase
{
    private readonly IMediator _mediator;

    public LikeController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateLike([FromBody] CreateLikeCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        command.UserId = userId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteLike([FromBody] DeleteLikeCommand command)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        command.UserId = userId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
