using System.Security.Claims;
using api.Features.User.DeleteUser;
using api.Features.User.GetUser;
using api.Features.User.UpdateUser;
using api.Services;
using Microsoft.AspNetCore.Authorization;
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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var response = await _getUserHandler.Handle(query, userId);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser([FromForm] UpdateUserCommand request, [FromForm] IFormFile? profilePicture)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }
        
        string? profilePictureUrl = null;

        if (profilePicture != null && profilePicture.Length > 0)
        {
            profilePictureUrl = await _s3Service.UploadImageAsync(profilePicture);
        }

        var result = await _updateUserHandler.Handle(userId, request, profilePictureUrl);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return StatusCode(500, new { message = "userId not found in claims" });
        }

        await _deleteUserHandler.Handle(userId);
        return Ok(new { message = "User account deleted successfully" });
    }
}
