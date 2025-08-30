using Microsoft.AspNetCore.Mvc;

namespace api.Features.Auth;

[ApiController]
[Route("/api/auth")]
public class AuthController : ControllerBase
{
    private readonly Login _loginHandler;
    private readonly Register _registerHandler;
    private readonly GetCurrentUser _getCurrentUserHandler;
    private readonly Logout _logoutHandler;

    public AuthController(Login loginHandler, Register registerHandler, GetCurrentUser getCurrentUserHandler, Logout logoutHandler)
    {
        _loginHandler = loginHandler;
        _registerHandler = registerHandler;
        _getCurrentUserHandler = getCurrentUserHandler;
        _logoutHandler = logoutHandler;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Login.Request request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var response = await _loginHandler.Handle(request);
        
        if (response == null)
        {
            return Unauthorized("Invalid username or password");
        }

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Register.Request request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var (response, errors) = await _registerHandler.Handle(request);
        
        if (response == null)
        {
            return BadRequest(errors);
        }

        return Created($"/api/user/{response.Username}", response);
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized();
        }
        var response = await _getCurrentUserHandler.Handle(User);
        if (response == null)
        {
            return NotFound("User not found");
        }
        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _logoutHandler.Handle();
        return NoContent();
    }
}
