using Microsoft.AspNetCore.Identity;
using api.Features.User;

namespace api.Features.Auth.Login;

public class LoginHandler
{
    private readonly SignInManager<api.Models.User> _signInManager;
    private readonly UserManager<api.Models.User> _userManager;

    public LoginHandler(SignInManager<api.Models.User> signInManager, UserManager<api.Models.User> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    public async Task<UserDto?> Handle(LoginCommand request)
    {
        var result = await _signInManager.PasswordSignInAsync(request.Username, request.Password, false, false);
        
        if (!result.Succeeded)
        {
            return null;
        }

        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null)
        {
            return null;
        }
        
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        };
    }
}
