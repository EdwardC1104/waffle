using api.Data;
using api.Exceptions;
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

    public async Task Handle(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            throw new ApiException(404, $"User with id {userId} not found");
        }

        // Option 1: Hard delete (removes all data)
        // This will cascade delete posts, likes, follows due to foreign key constraints
        var result = await _userManager.DeleteAsync(user);
        
        if (!result.Succeeded)
        {
            throw new ApiException(500, "Failed to delete user");
        }

        await _signInManager.SignOutAsync();
    }
}
