using api.Data;
using api.Features.User;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace api.Features.Auth.GitHubLogin;

public class GitHubLoginHandler
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

    public async Task<UserDto?> Handle(ClaimsPrincipal gitHubUser)
    {
        var email = gitHubUser.FindFirst(ClaimTypes.Email)?.Value;
        var gitHubId = gitHubUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var name = gitHubUser.FindFirst(ClaimTypes.Name)?.Value;
        var userName = gitHubUser.FindFirst("login")?.Value ?? gitHubId;

        if (string.IsNullOrEmpty(gitHubId))
        {
            return null;
        }

        // Check if user already exists with this GitHub ID
        var existingUser = await _userManager.FindByLoginAsync("GitHub", gitHubId);
        
        if (existingUser != null)
        {
            // User exists, sign them in
            await _signInManager.SignInAsync(existingUser, isPersistent: false);
            return await existingUser.ToDtoAsync(_dbContext);
        }

        // // Check if user exists with this email
        // if (!string.IsNullOrEmpty(email))
        // {
        //     var userByEmail = await _userManager.FindByEmailAsync(email);
        //     if (userByEmail != null)
        //     {
        //         // Link GitHub account to existing user
        //         await _userManager.AddLoginAsync(userByEmail, new UserLoginInfo("GitHub", gitHubId, "GitHub"));
        //         await _signInManager.SignInAsync(userByEmail, isPersistent: false);
        //         userByEmail.UpdatedAt = DateTime.UtcNow;
        //         await _userManager.UpdateAsync(userByEmail);
        //         return await userByEmail.ToDtoAsync(_dbContext);
        //     }
        // }

        // Create new user
        var newUser = new api.Models.User
        {
            UserName = await GenerateUniqueUsername(userName ?? name ?? $"user_{gitHubId}"),
            Email = email,
            Name = name ?? userName ?? "GitHub User",
            EmailConfirmed = !string.IsNullOrEmpty(email),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(newUser);
        if (result.Succeeded)
        {
            await _userManager.AddLoginAsync(newUser, new UserLoginInfo("GitHub", gitHubId, "GitHub"));
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
