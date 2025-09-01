using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using api.Data;
using api.Features.User;

namespace api.Features.Auth.GetCurrentUser;

public class GetCurrentUserHandler
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly AppDbContext _dbContext;

    public GetCurrentUserHandler(UserManager<api.Models.User> userManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<UserDto?> Handle(ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return null;
    
        var appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null) return null;
    
        return await appUser.ToDtoAsync(_dbContext);
    }
}