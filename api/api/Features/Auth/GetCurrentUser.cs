using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace api.Features.Auth;

public class GetCurrentUser
{
    private readonly UserManager<api.Models.User> _userManager;

    public GetCurrentUser(UserManager<api.Models.User> userManager)
    {
        _userManager = userManager;
    }
    
    public class Response
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public async Task<Response?> Handle(ClaimsPrincipal user)
    {
        var username = user.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return null;
        var appUser = await _userManager.FindByNameAsync(username);
        if (appUser == null) return null;
        return new Response
        {
            Id = appUser.Id,
            Name = appUser.Name,
            Username = appUser.UserName ?? string.Empty,
            Email = appUser.Email ?? string.Empty
        };
    }
}