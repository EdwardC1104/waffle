using api.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Features.User.DeleteUser;

public class DeleteUserHandler
{
    private readonly UserManager<Models.User> _userManager;
    private readonly SignInManager<Models.User> _signInManager;
    private readonly AppDbContext _dbContext;

    public DeleteUserHandler(UserManager<Models.User> userManager, SignInManager<Models.User> signInManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
    }

    public async Task<bool> Handle(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            return false;
        }

        // Option 1: Hard delete (removes all data)
        // This will cascade delete posts, likes, follows due to foreign key constraints
        var result = await _userManager.DeleteAsync(user);
        
        if (result.Succeeded)
        {
            // Sign out the user after deletion
            await _signInManager.SignOutAsync();
            return true;
        }

        return false;
    }
}
