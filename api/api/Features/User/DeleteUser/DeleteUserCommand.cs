using MediatR;

namespace api.Features.User.DeleteUser;

public class DeleteUserCommand : IRequest
{
    public string UserId { get; set; } = null!;
}
