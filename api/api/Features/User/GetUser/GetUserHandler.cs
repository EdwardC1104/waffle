using api.Data;
using api.Exceptions;
using api.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace api.Features.User.GetUser;

public class GetUserHandler : IRequestHandler<GetUserQuery, UserDto>
{
    private readonly UserManager<Models.User> _userManager;
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;
    
    public GetUserHandler(UserManager<Models.User> userManager, AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _userManager = userManager;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }
    
    public async Task<UserDto> Handle(GetUserQuery query, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByNameAsync(query.Username);

        if (user == null)
        {
            throw new ApiException(404, $"User with username {query.Username} not found");
        }
        
        var userId = _currentUserService.GetUserIdOrNull();

        return await user.ToDtoAsync(_dbContext, userId);
    }
}