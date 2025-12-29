using api.Data;
using api.Exceptions;
using api.Features.User;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace api.Features.Auth.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, UserDto>
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly SignInManager<api.Models.User> _signInManager;
    private readonly AppDbContext _dbContext;

    public RegisterHandler(UserManager<api.Models.User> userManager, SignInManager<api.Models.User> signInManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
    }

    public async Task<UserDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var newUser = new api.Models.User
        {
            Name = request.Name,
            UserName = request.Username,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(newUser, request.Password);
        
        if (!result.Succeeded)
        {
            throw new ApiException(400, string.Join(" ", result.Errors.Select(e => e.Description)));
        }

        await _signInManager.SignInAsync(newUser, isPersistent: true);

        return await newUser.ToDtoAsync(_dbContext);
    }
}
