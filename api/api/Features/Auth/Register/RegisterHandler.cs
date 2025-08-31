using Microsoft.AspNetCore.Identity;
using api.Features.User;

namespace api.Features.Auth.Register;

public class RegisterHandler
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly SignInManager<api.Models.User> _signInManager;

    public RegisterHandler(UserManager<api.Models.User> userManager, SignInManager<api.Models.User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<(UserDto? response, IEnumerable<IdentityError>? errors)> Handle(RegisterCommand request)
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

        return (new UserDto
        {
            Id = newUser.Id,
            Name = newUser.Name,
            Username = newUser.UserName ?? string.Empty,
            Email = newUser.Email ?? string.Empty,
            ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }, null);
    }
}
