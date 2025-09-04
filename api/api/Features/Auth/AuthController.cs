using api.Features.Auth.GetCurrentUser;
using api.Features.Auth.GitHubLogin;
using api.Features.Auth.Login;
using api.Features.Auth.Logout;
using api.Features.Auth.Register;
using Microsoft.AspNetCore.Authentication;
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
    private readonly GitHubLoginHandler _gitHubLoginHandler;

    public AuthController(LoginHandler loginHandlerHandler, RegisterHandler registerHandlerHandler, GetCurrentUserHandler getCurrentUserHandlerHandler, LogoutHandler logoutHandlerHandler, GitHubLoginHandler gitHubLoginHandler)
    {
        _loginHandlerHandler = loginHandlerHandler;
        _registerHandlerHandler = registerHandlerHandler;
        _getCurrentUserHandlerHandler = getCurrentUserHandlerHandler;
        _logoutHandlerHandler = logoutHandlerHandler;
        _gitHubLoginHandler = gitHubLoginHandler;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand request)
    {
        var response = await _loginHandlerHandler.Handle(request);
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand request)
    {
        var response = await _registerHandlerHandler.Handle(request);
        return Created($"/api/user/{response.Username}", response);
    }

    [HttpPost("me")]
    public async Task<IActionResult> Me()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Unauthorized(new { message =  "Not logged in" });
        }
        var response = await _getCurrentUserHandlerHandler.Handle(User);
        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _logoutHandlerHandler.Handle();
        return Ok(new { message = "Successfully logged out" });
    }
    
    [HttpGet("github")]
    public IActionResult GitHubLogin(string? returnUrl = null)
    {
        var redirectUrl = Url.Action(nameof(GitHubCallback), "Auth", new { returnUrl });
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
        return Challenge(properties, "GitHub");
    }

    [HttpGet("github/callback")]
    public async Task<IActionResult> GitHubCallback(string? returnUrl = null)
    {
        var authenticateResult = await HttpContext.AuthenticateAsync("GitHub");
        
        if (!authenticateResult.Succeeded)
        {
            return BadRequest(new { message = "GitHub authentication failed" });
        }

        var user = await _gitHubLoginHandler.Handle(authenticateResult.Principal);
        
        if (user == null)
        {
            return BadRequest(new { message = "Failed to create or login user" });
        }

        if (!string.IsNullOrEmpty(returnUrl))
        {
            return Redirect(returnUrl);
        }

        return Ok(user);
    }
}
