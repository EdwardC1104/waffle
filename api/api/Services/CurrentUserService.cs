using System.Security.Claims;
using api.Exceptions;

namespace api.Services;

public class CurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private string? UserId => _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

    public string GetRequiredUserId()
    {
        var userId = UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new ApiException(401, "User ID not found in claims");
        }
        return userId;
    }

    public string? GetUserIdOrNull()
    {
        return UserId;
    }
}
