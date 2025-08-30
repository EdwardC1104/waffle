using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace api.Features.Auth;

public class Register
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly SignInManager<api.Models.User> _signInManager;

    public Register(UserManager<api.Models.User> userManager, SignInManager<api.Models.User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public class Request
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;
    }

    public class Response
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }

    public async Task<(Response? response, IEnumerable<IdentityError>? errors)> Handle(Request request)
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
            return (null, result.Errors);
        }

        // Automatically sign in the user after successful registration
        await _signInManager.SignInAsync(newUser, isPersistent: false);

        return (new Response
        {
            Id = newUser.Id,
            Name = newUser.Name,
            Username = newUser.UserName ?? string.Empty,
            Email = newUser.Email ?? string.Empty,
            ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }, null);
    }
}
