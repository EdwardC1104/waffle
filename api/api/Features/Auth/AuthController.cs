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
    private readonly UserManager<Models.User> _userManager;
    private readonly SignInManager<Models.User> _signInManager;

    public AuthController(SignInManager<Models.User> signInManager, UserManager<Models.User> userManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }
    
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    
        
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        
        public string Username { get; set; } = string.Empty;
        
        public string Email { get; set; } = string.Empty;
        
        public string Password { get; set; } = string.Empty;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _signInManager.PasswordSignInAsync(request.Username, request.Password, false, false);
        
        if (!result.Succeeded)
        {
            return BadRequest(result);
        }

        return Ok();
    }
    [HttpPost("register")]
    public async Task<IActionResult> Signup([FromBody] RegisterRequest request)
    {
        var newUser = new api.Models.User
        {
            Name = request.Name,
            UserName = request.Username,
            Email = request.Email,
        };

        var result = await _userManager.CreateAsync(newUser, request.Password);
        
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { Id = newUser.Id });
    }
}
