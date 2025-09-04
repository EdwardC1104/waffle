using System.ComponentModel.DataAnnotations;

namespace api.Features.User.UpdateUser;

public class UpdateUserCommand {
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string? Name { get; set; }
    
    [StringLength(100, ErrorMessage = "Username cannot exceed 100 characters")]
    public string? Username { get; set; }
}
