using api.Features.Auth.GetCurrentUser;
using api.Features.Auth.Login;
using api.Features.Auth.Logout;
using api.Features.Auth.Register;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Auth;

[ApiController]
[Route("/api/auth")]
public class AuthController : ControllerBase
{
    private readonly LoginHandler _loginHandlerHandler;
    private readonly RegisterHandler _registerHandlerHandler;
    private readonly GetCurrentUserHandler _getCurrentUserHandlerHandler;
    private readonly LogoutHandler _logoutHandlerHandler;

    public AuthController(LoginHandler loginHandlerHandler, RegisterHandler registerHandlerHandler, GetCurrentUserHandler getCurrentUserHandlerHandler, LogoutHandler logoutHandlerHandler)
    {
        _loginHandlerHandler = loginHandlerHandler;
        _registerHandlerHandler = registerHandlerHandler;
        _getCurrentUserHandlerHandler = getCurrentUserHandlerHandler;
        _logoutHandlerHandler = logoutHandlerHandler;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var response = await _loginHandlerHandler.Handle(request);
        
        if (response == null)
        {
            return Unauthorized("Invalid username or password");
        }

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var (response, errors) = await _registerHandlerHandler.Handle(request);
        
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
        var response = await _getCurrentUserHandlerHandler.Handle(User);
        if (response == null)
        {
            return NotFound("User not found");
        }
        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _logoutHandlerHandler.Handle();
        return NoContent();
    }
}
