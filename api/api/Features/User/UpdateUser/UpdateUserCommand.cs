using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.User.UpdateUser;

public class UpdateUserCommand : IRequest<UserDto>
{
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string? Name { get; set; }
    
    [StringLength(100, ErrorMessage = "Username cannot exceed 100 characters")]
    public string? Username { get; set; }
    
    public string UserId { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
}
