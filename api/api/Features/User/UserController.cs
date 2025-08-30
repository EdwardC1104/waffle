using Microsoft.AspNetCore.Mvc;

namespace api.Features.User;

[ApiController]
[Route("/api/user")]
public class UserController : ControllerBase
{
    private readonly GetUser _getUser;

    public UserController(GetUser getUser)
    {
        _getUser = getUser;
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetUser(string username)
    {
        var response = await _getUser.Handle(username);
        
        if (response == null)
        {
            return NotFound($"User with username '{username}' not found");
        }
        
        return Ok(response);
    }
}
