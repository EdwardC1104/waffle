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

    public async Task<IEnumerable<UserDto>> Handle(string userId)
    {
        
        var users = await _context.Users
            .Where(u => u.Id != userId)
            .Take(7)
            .ToListAsync();

        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_context);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
    
    public async Task<IEnumerable<UserDto>> Handle()
    {
        var users = await _context.Users
            .Take(7)
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