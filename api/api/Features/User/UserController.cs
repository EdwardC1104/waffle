using System.Security.Claims;
using api.Features.User.DeleteUser;
using api.Features.User.GetUser;
using api.Features.User.UpdateUser;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.User;

[ApiController]
[Route("/api/user")]
public class UserController : ControllerBase
{
    private readonly GetUserHandler _getUserHandler;
    private readonly UpdateUserHandler _updateUserHandler;
    private readonly DeleteUserHandler _deleteUserHandler;

    public UserController(GetUserHandler getUserHandler, UpdateUserHandler updateUserHandler, DeleteUserHandler deleteUserHandler)
    {
        _getUserHandler = getUserHandler;
        _updateUserHandler = updateUserHandler;
        _deleteUserHandler = deleteUserHandler;
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetUser([FromBody] GetUserQuery query)
    {
        var response = await _getUserHandler.Handle(query);
        
        if (response == null)
        {
            return NotFound(new { message = $"User with username '{query.Username}' not found" });
        }
        
        return Ok(response);
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserCommand request)
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

        var result = await _updateUserHandler.Handle(userId, request);
        
        if (result == null)
        {
            return BadRequest(new { message = "Failed to update user. Username may already be taken or user not found." });
        }
        
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

        var success = await _deleteUserHandler.Handle(userId);
        
        if (success)
        {
            return Ok(new { message = "User account deleted successfully" });
        }
        
        return BadRequest(new { message = "Failed to delete user account" });
    }
}
