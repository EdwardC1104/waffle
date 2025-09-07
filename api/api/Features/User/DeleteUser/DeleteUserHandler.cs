using api.Data;
using api.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Features.User.DeleteUser;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand>
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

    public async Task Handle(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(command.UserId);
        
        if (user == null)
        {
            throw new ApiException(404, $"User with id {command.UserId} not found");
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
