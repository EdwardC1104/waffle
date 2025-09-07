using System.Security.Claims;
using api.Features.Search.SearchUsersAndPosts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Search;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly IMediator _mediator;

    public SearchController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("search-users-and-posts")]
    public async Task<IActionResult> GetPosts([FromBody] SearchUsersAndPostsQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }
}