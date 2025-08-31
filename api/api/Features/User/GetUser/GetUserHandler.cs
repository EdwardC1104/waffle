using Microsoft.AspNetCore.Identity;

namespace api.Features.User.GetUser;

public class GetUserHandler
{
    private readonly UserManager<Models.User> _userManager;
    public GetUserHandler(UserManager<Models.User> userManager)
    {
        _userManager = userManager;
    }
    
    public async Task<UserDto?> Handle(string username)
    {
        var user = await _userManager.FindByNameAsync(username);

        if (user == null)
        {
            return null;
        }

        var response = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.UserName,
            Email = user.Email,
            ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        };

        return response;
    }
}