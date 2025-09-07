using System.Security.Claims;
using api.Features.Auth.GetCurrentUser;
using api.Features.Auth.GitHubLogin;
using api.Features.Auth.Login;
using api.Features.Auth.Logout;
using api.Features.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Auth;

[ApiController]
[Route("/api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand request)
    {
        var response = await _mediator.Send(request);
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand request)
    {
        var response = await _mediator.Send(request);
        return Created($"/api/user/{response.Username}", response);
    }

    [Authorize]
    [HttpPost("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        var response = await _mediator.Send(new GetCurrentUserQuery(userId));
        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _mediator.Send(new LogoutCommand());
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

        var gitHubUser = authenticateResult.Principal;
        var command = new GitHubLoginCommand
        {
            Email = gitHubUser.FindFirst(ClaimTypes.Email)?.Value,
            GitHubId = gitHubUser.FindFirst(ClaimTypes.NameIdentifier)?.Value!,
            Name = gitHubUser.FindFirst(ClaimTypes.Name)?.Value,
            UserName = gitHubUser.FindFirst("login")?.Value
        };

        var user = await _mediator.Send(command);
        
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
