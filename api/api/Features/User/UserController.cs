using System.Security.Claims;
using api.Features.User.DeleteUser;
using api.Features.User.GetUser;
using api.Features.User.UpdateUser;
using api.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Features.User;

[ApiController]
[Route("/api/user")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly S3Service _s3Service;

    public UserController(IMediator mediator, S3Service s3Service)
    {
        _mediator = mediator;
        _s3Service = s3Service;
    }

    [HttpPost("get")]
    public async Task<IActionResult> GetUser([FromBody] GetUserQuery query)
    {
        var response = await _mediator.Send(query);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("update")]
    public async Task<IActionResult> UpdateUser([FromForm] UpdateUserCommand request, [FromForm] IFormFile? profilePicture)
    {
        string? profilePictureUrl = null;

        if (profilePicture != null && profilePicture.Length > 0)
        {
            profilePictureUrl = await _s3Service.UploadImageAsync(profilePicture);
        }
        
        request.ProfilePictureUrl = profilePictureUrl;
        var result = await _mediator.Send(request);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("delete")]
    public async Task<IActionResult> DeleteUser()
    {
        await _mediator.Send(new DeleteUserCommand());
        return Ok(new { message = "User account deleted successfully" });
    }
}
