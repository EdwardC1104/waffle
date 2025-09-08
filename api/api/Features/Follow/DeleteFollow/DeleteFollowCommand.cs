using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Follow.DeleteFollow;

public record DeleteFollowCommand : IRequest
{
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
}
