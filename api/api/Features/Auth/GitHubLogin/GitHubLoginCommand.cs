using api.Features.User;
using MediatR;

namespace api.Features.Auth.GitHubLogin;

public class GitHubLoginCommand : IRequest<UserDto?>
{
    public string? Email { get; set; }
    public string GitHubId { get; set; } = null!;
    public string? Name { get; set; }
    public string? UserName { get; set; }
}
