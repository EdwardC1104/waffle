using Microsoft.AspNetCore.Identity;

namespace api.Features.Auth;

public class Logout
{
    private readonly SignInManager<api.Models.User> _signInManager;

    public Logout(SignInManager<api.Models.User> signInManager)
    {
        _signInManager = signInManager;
    }
    
    public async Task Handle()
    {
        await _signInManager.SignOutAsync();
    }
}
