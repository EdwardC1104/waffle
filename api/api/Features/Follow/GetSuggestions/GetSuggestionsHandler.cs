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
        // Get all users except the current user
        var users = await _context.Users
            .Where(u => u.UserName != query.Username)
            .ToListAsync();

        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_context);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}