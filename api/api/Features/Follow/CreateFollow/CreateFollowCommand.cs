using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.CreateFollow;

public class CreateFollowCommand
{
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
}