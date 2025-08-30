using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.Auth;

[ApiController]
[Route("/api/auth")]
public class AuthController : ControllerBase
{
    private readonly Login _loginHandler;
    private readonly Register _registerHandler;

    public AuthController(Login loginHandler, Register registerHandler)
    {
        _loginHandler = loginHandler;
        _registerHandler = registerHandler;
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
}
