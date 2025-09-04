using System.Security.Claims;
using api.Features.User.DeleteUser;
using api.Features.User.GetUser;
using api.Features.User.UpdateUser;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.User;

[ApiController]
[Route("/api/user")]
public class UserController : ControllerBase
{
    private readonly GetUserHandler _getUserHandler;
    private readonly UpdateUserHandler _updateUserHandler;
    private readonly DeleteUserHandler _deleteUserHandler;
    private readonly S3Service _s3Service;

    public UserController(GetUserHandler getUserHandler, UpdateUserHandler updateUserHandler, DeleteUserHandler deleteUserHandler, S3Service s3Service)
    {
        _getUserHandler = getUserHandler;
        _updateUserHandler = updateUserHandler;
        _deleteUserHandler = deleteUserHandler;
        _s3Service = s3Service;
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetUser([FromBody] GetUserQuery query)
    {
        var response = await _getUserHandler.Handle(query);
        return Ok(response);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser([FromForm] UpdateUserCommand request, [FromForm] IFormFile? profilePicture)
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        string? profilePictureUrl = null;

        if (profilePicture != null && profilePicture.Length > 0)
        {
            profilePictureUrl = await _s3Service.UploadImageAsync(profilePicture);
        }

        var result = await _updateUserHandler.Handle(userId, request, profilePictureUrl);
        return Ok(result);
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteUser()
    {
        if (User.Identity is not { IsAuthenticated: true, Name: not null })
        {
            return Unauthorized(new { message = "Not logged in" });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized(new { message = "Not logged in" });
        }

        await _deleteUserHandler.Handle(userId);
        return Ok(new { message = "User account deleted successfully" });
    }
}
