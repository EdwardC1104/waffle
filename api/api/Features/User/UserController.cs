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

    [HttpPost("get")]
    public async Task<IActionResult> GetUser([FromBody] GetUserQuery query)
    {
        if (!ModelState.IsValid)
        {
            var errorMessage = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
            return BadRequest(new { message = errorMessage });
        }
        var response = await _getUserHandler.Handle(query);
        
        if (response == null)
        {
            return NotFound(new { message = $"User with username '{query.Username}' not found" });
        }
        
        return Ok(response);
    }
}
