using api.Data;
using api.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace api.Features.User.UpdateUser;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly UserManager<Models.User> _userManager;
    private readonly AppDbContext _dbContext;

    public UpdateUserHandler(UserManager<Models.User> userManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        
        if (user == null)
        {
            throw new ApiException(404, $"User not found");
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
                throw new ApiException(409, $"User with username {request.Username} already exists");
            }
            user.UserName = request.Username;
        }

        // Update profile picture URL if provided
        if (!string.IsNullOrEmpty(request.ProfilePictureUrl))
        {
            user.ProfilePictureUrl = request.ProfilePictureUrl;
        }

        // Update UpdatedAt on profile update
        user.UpdatedAt = DateTime.UtcNow;

        // Use UserManager to update the user
        var result = await _userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
        {
            throw new ApiException(500, "Failed to update user");
        }

        return await user.ToDtoAsync(_dbContext, request.UserId);
    }
}
