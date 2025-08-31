using api.Data;
using Microsoft.AspNetCore.Identity;
using api.Features.User;

namespace api.Features.Auth.Login;

public class LoginHandler
{
    private readonly SignInManager<api.Models.User> _signInManager;
    private readonly UserManager<api.Models.User> _userManager;
    private readonly AppDbContext _dbContext;

    public LoginHandler(SignInManager<api.Models.User> signInManager, UserManager<api.Models.User> userManager, AppDbContext dbContext)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _dbContext = dbContext;
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

        return await user.ToDtoAsync(_dbContext);
    }
}
