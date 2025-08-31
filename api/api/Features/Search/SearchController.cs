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
            response = await _searchUsersAndPostsHandler.Handle(User.Identity.Name, query);

        }
        else
        {
            response = await _searchUsersAndPostsHandler.Handle(query);
        }
        
        return Ok(response);
    }
}