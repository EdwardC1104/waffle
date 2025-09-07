using System.Security.Claims;
using api.Features.Search.SearchUsersAndPosts;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Search;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly SearchUsersAndPostsHandler _searchUsersAndPostsHandler;

    public SearchController(SearchUsersAndPostsHandler searchUsersAndPostsHandler)
    {
        _searchUsersAndPostsHandler = searchUsersAndPostsHandler;
    }

    [HttpPost("search-users-and-posts")]
    public async Task<IActionResult> GetPosts([FromBody] SearchUsersAndPostsQuery query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _searchUsersAndPostsHandler.Handle(query, userId);
        return Ok(response);
    }
}