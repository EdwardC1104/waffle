using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow;

public class GetSuggestions
{
    private readonly AppDbContext _context;

    public GetSuggestions(AppDbContext context)
    {
        _context = context;
    }

    
    public class Response
    {
        public IEnumerable<UserDto> Users { get; set; } = new List<UserDto>();
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }

    public async Task<Response> Handle(string username)
    {
        // For now, get all users except the current user
        var users = await _context.Users
            .Where(u => u.UserName != username)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Username = u.UserName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            })
            .ToListAsync();

        return new Response { Users = users };
    }
}