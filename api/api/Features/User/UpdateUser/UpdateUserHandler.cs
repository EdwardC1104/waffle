using api.Data;
using Microsoft.AspNetCore.Identity;

namespace api.Features.User.UpdateUser;

public class UpdateUserHandler
{
    private readonly UserManager<Models.User> _userManager;
    private readonly AppDbContext _dbContext;

    public UpdateUserHandler(UserManager<Models.User> userManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<UserDto?> Handle(string userId, UpdateUserCommand request, string? profilePictureUrl = null)
    {
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            return null;
        }

        // Update name if provided
        if (!string.IsNullOrEmpty(request.Name))
        {
            user.Name = request.Name;
        }

        // Update username if provided and not already taken
        if (!string.IsNullOrEmpty(request.Username) && request.Username != user.UserName)
        {
            var existingUser = await _userManager.FindByNameAsync(request.Username);
            if (existingUser != null)
            {
                return null; // Username already exists
            }
            user.UserName = request.Username;
        }

        // Update profile picture URL if provided
        if (!string.IsNullOrEmpty(profilePictureUrl))
        {
            user.ProfilePictureUrl = profilePictureUrl;
        }

        // Update UpdatedAt on profile update
        user.UpdatedAt = DateTime.UtcNow;

        // Use UserManager to update the user
        var result = await _userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
        {
            return null;
        }

        return await user.ToDtoAsync(_dbContext);
    }
}
