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
        SearchUsersAndPostsResponse response;
        if (User.Identity is { IsAuthenticated: true, Name: not null })
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { message = "Not logged in" });
            }
            response = await _searchUsersAndPostsHandler.Handle(userId, query);
        }
        else
        {
            response = await _searchUsersAndPostsHandler.Handle(query);
        }
        
        return Ok(response);
    }
}