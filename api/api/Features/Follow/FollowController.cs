using api.Features.Follow.CreateFollow;
using api.Features.Follow.DeleteFollow;
using api.Features.Follow.GetFollowers;
using api.Features.Follow.GetFollowing;
using api.Features.Follow.GetSuggestions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Follow;

[ApiController]
[Route("api/follow")]
public class FollowController : ControllerBase
{
    private readonly IMediator _mediator;

    public FollowController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("suggestions")]
    public async Task<IActionResult> GetSuggestions()
    {
        var response = await _mediator.Send(new GetSuggestionsQuery());
        return Ok(response);
    }

    [HttpPost("followers")]
    public async Task<IActionResult> GetFollowers([FromBody] GetFollowersQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    [HttpPost("following")]
    public async Task<IActionResult> GetFollowing([FromBody] GetFollowingQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Follow([FromBody] CreateFollowCommand command)
    {
        await _mediator.Send(command);
        return Ok(new { message = "Successfully followed user" });
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> Unfollow([FromBody] DeleteFollowCommand command)
    {
        await _mediator.Send(command);
        return Ok(new { message = "Successfully unfollowed user" });
    }
}
