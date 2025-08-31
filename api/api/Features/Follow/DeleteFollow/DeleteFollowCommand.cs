using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.DeleteFollow;

public class DeleteFollowCommand
{
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
}
