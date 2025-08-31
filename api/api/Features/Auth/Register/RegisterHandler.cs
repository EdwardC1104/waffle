using api.Data;
using Microsoft.AspNetCore.Identity;
using api.Features.User;

namespace api.Features.Auth.Register;

public class RegisterHandler
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly SignInManager<api.Models.User> _signInManager;
    private readonly AppDbContext _dbContext;

    public RegisterHandler(UserManager<api.Models.User> userManager, SignInManager<api.Models.User> signInManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
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

        return (await newUser.ToDtoAsync(_dbContext), null);
    }
}
