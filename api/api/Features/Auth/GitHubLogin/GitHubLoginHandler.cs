using api.Data;
using api.Features.User;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace api.Features.Auth.GitHubLogin;

public class GitHubLoginHandler : IRequestHandler<GitHubLoginCommand, UserDto?>
{
    private readonly UserManager<api.Models.User> _userManager;
    private readonly SignInManager<api.Models.User> _signInManager;
    private readonly AppDbContext _dbContext;

    public GitHubLoginHandler(UserManager<api.Models.User> userManager, SignInManager<api.Models.User> signInManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
    }

    public async Task<UserDto?> Handle(GitHubLoginCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.GitHubId))
        {
            return null;
        }

        // Check if user already exists with this GitHub ID
        var existingUser = await _userManager.FindByLoginAsync("GitHub", request.GitHubId);
        
        if (existingUser != null)
        {
            // User exists, sign them in
            await _signInManager.SignInAsync(existingUser, isPersistent: false);
            return await existingUser.ToDtoAsync(_dbContext);
        }

        // Create new user
        var newUser = new api.Models.User
        {
            UserName = await GenerateUniqueUsername(request.UserName ?? request.Name ?? $"user_{request.GitHubId}"),
            Email = request.Email,
            Name = request.Name ?? request.UserName ?? "GitHub User",
            EmailConfirmed = !string.IsNullOrEmpty(request.Email),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(newUser);
        if (result.Succeeded)
        {
            await _userManager.AddLoginAsync(newUser, new UserLoginInfo("GitHub", request.GitHubId, "GitHub"));
            await _signInManager.SignInAsync(newUser, isPersistent: false);
            return await newUser.ToDtoAsync(_dbContext);
        }

        return null;
    }

    private async Task<string> GenerateUniqueUsername(string baseUsername)
    {
        var username = baseUsername.Replace(" ", "_").ToLower();
        var originalUsername = username;
        var counter = 1;

        while (await _userManager.FindByNameAsync(username) != null)
        {
            username = $"{originalUsername}_{counter}";
            counter++;
        }

        return username;
    }
}
