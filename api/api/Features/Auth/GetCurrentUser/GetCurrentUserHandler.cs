using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using api.Features.User;

namespace api.Features.Auth.GetCurrentUser;

public class GetCurrentUserHandler
{
    private readonly UserManager<api.Models.User> _userManager;

    public GetCurrentUserHandler(UserManager<api.Models.User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<UserDto?> Handle(ClaimsPrincipal user)
    {
        var username = user.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return null;
        var appUser = await _userManager.FindByNameAsync(username);
        if (appUser == null) return null;
        return new UserDto
        {
            Id = appUser.Id,
            Name = appUser.Name,
            Username = appUser.UserName ?? string.Empty,
            Email = appUser.Email ?? string.Empty,
            ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        };
    }
}