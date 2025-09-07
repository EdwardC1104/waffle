using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using api.Data;
using api.Exceptions;
using api.Features.User;
using MediatR;

namespace api.Features.Auth.GetCurrentUser;

public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserQuery, UserDto>
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly AppDbContext _dbContext;

    public GetCurrentUserHandler(UserManager<api.Models.User> userManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<UserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var appUser = await _userManager.FindByIdAsync(request.UserId);
        if (appUser == null)
        {
            throw new ApiException(401, "Unauthorized");
        }
    
        return await appUser.ToDtoAsync(_dbContext);
    }
}