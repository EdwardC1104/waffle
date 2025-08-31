using api.Data;
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
    
    public async Task<UserDto?> Handle(GetUserQuery query)
    {
        var user = await _userManager.FindByNameAsync(query.Username);

        if (user == null)
        {
            return null;
        }

        return await user.ToDtoAsync(_dbContext);
    }
}