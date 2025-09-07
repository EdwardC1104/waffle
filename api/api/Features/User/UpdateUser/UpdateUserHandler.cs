using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace api.Features.User.UpdateUser;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly UserManager<Models.User> _userManager;
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;

    public UpdateUserHandler(UserManager<Models.User> userManager, AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _userManager = userManager;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            throw new ApiException(404, $"User not found");
        }

        if (!string.IsNullOrEmpty(request.Name))
        {
            user.Name = request.Name;
        }

        if (!string.IsNullOrEmpty(request.Username) && request.Username != user.UserName)
        {
            var existingUser = await _userManager.FindByNameAsync(request.Username);
            if (existingUser != null)
            {
                throw new ApiException(409, $"User with username {request.Username} already exists");
            }
            user.UserName = request.Username;
        }

        if (!string.IsNullOrEmpty(request.ProfilePictureUrl))
        {
            user.ProfilePictureUrl = request.ProfilePictureUrl;
        }

        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
        {
            throw new ApiException(500, "Failed to update user");
        }

        return await user.ToDtoAsync(_dbContext, userId);
    }
}
