using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Features.User.DeleteUser;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly UserManager<Models.User> _userManager;
    private readonly SignInManager<Models.User> _signInManager;
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;

    public DeleteUserHandler(UserManager<Models.User> userManager, SignInManager<Models.User> signInManager, AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
        {
            throw new ApiException(404, $"User with id {userId} not found");
        }
        
        var result = await _userManager.DeleteAsync(user);
        
        if (!result.Succeeded)
        {
            throw new ApiException(500, "Failed to delete user");
        }

        await _signInManager.SignOutAsync();
    }
}
