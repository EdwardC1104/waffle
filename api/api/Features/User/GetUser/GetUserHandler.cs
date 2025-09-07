using api.Data;
using api.Exceptions;
using Microsoft.AspNetCore.Identity;

namespace api.Features.User.GetUser;

public class GetUserHandler
{
    private readonly UserManager<Models.User> _userManager;
    private readonly AppDbContext _dbContext;
    public GetUserHandler(UserManager<Models.User> userManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }
    
    public async Task<UserDto> Handle(GetUserQuery query, string? userId = null)
    {
        var user = await _userManager.FindByNameAsync(query.Username);

        if (user == null)
        {
            throw new ApiException(404, $"User with username {query.Username} not found");
        }

        return await user.ToDtoAsync(_dbContext, userId);
    }
}