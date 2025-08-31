using api.Features.User.GetUser;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.User;

[ApiController]
[Route("/api/user")]
public class UserController : ControllerBase
{
    private readonly GetUserHandler _getUserHandler;

    public UserController(GetUserHandler getUserHandler)
    {
        _getUserHandler = getUserHandler;
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetUser(string username)
    {
        var response = await _getUserHandler.Handle(username);
        
        if (response == null)
        {
            return NotFound($"User with username '{username}' not found");
        }
        
        return Ok(response);
    }
}
