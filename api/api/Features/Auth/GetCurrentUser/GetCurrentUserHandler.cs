using Microsoft.AspNetCore.Identity;
using api.Data;
using api.Exceptions;
using api.Features.User;
using api.Services;
using MediatR;

namespace api.Features.Auth.GetCurrentUser;

public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserQuery, UserDto>
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly AppDbContext _dbContext;
    private readonly CurrentUserService _currentUserService;

    public GetCurrentUserHandler(UserManager<api.Models.User> userManager, AppDbContext dbContext, CurrentUserService currentUserService)
    {
        _userManager = userManager;
        _dbContext = dbContext;
        _currentUserService = currentUserService;
    }

    public async Task<UserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetRequiredUserId();
        
        var appUser = await _userManager.FindByIdAsync(userId);
        if (appUser == null)
        {
            throw new ApiException(401, "Unauthorized");
        }
    
        return await appUser.ToDtoAsync(_dbContext);
    }
}