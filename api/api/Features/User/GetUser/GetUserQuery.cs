using System.ComponentModel.DataAnnotations;

namespace api.Features.User.GetUser;

public class GetUserQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}