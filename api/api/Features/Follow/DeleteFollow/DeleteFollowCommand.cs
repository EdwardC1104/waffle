using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Follow.DeleteFollow;

public class DeleteFollowCommand : IRequest
{
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
    public string UserId { get; set; } = null!;
}
