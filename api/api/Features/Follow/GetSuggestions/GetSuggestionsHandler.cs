using api.Data;
using api.Features.User;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetSuggestions;

public class GetSuggestionsHandler
{
    private readonly AppDbContext _context;

    public GetSuggestionsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetSuggestionsQuery query)
    {
        // For now, get all users except the current user
        var users = await _context.Users
            .Where(u => u.UserName != query.Username)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Username = u.UserName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            })
            .ToListAsync();

        return users;
    }
}