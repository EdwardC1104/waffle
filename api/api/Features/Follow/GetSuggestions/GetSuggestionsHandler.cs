using api.Data;
using api.Features.User;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetSuggestions;

public class GetSuggestionsHandler : IRequestHandler<GetSuggestionsQuery, IEnumerable<UserDto>>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public GetSuggestionsHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetSuggestionsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetUserIdOrNull();
        var users = await _context.Users
            .Where(u => u.Id != userId)
            .Take(7)
            .ToListAsync(cancellationToken);

        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_context, userId);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}