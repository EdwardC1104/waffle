using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Follow.CreateFollow;

public record CreateFollowCommand : IRequest
{
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
}