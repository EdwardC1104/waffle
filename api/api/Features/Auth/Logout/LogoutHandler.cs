using MediatR;
using Microsoft.AspNetCore.Identity;

namespace api.Features.Auth.Logout;

public class LogoutHandler : IRequestHandler<LogoutCommand>
{
    private readonly SignInManager<api.Models.User> _signInManager;

    public LogoutHandler(SignInManager<api.Models.User> signInManager)
    {
        _signInManager = signInManager;
    }
    
    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _signInManager.SignOutAsync();
    }
}
