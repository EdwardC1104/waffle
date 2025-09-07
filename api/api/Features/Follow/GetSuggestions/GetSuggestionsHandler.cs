using api.Data;
using api.Features.User;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetSuggestions;

public record GetSuggestionsQuery(string? UserId) : IRequest<IEnumerable<UserDto>>;

public class GetSuggestionsHandler : IRequestHandler<GetSuggestionsQuery, IEnumerable<UserDto>>
{
    private readonly AppDbContext _context;

    public GetSuggestionsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetSuggestionsQuery request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .Where(u => u.Id != request.UserId)
            .Take(7)
            .ToListAsync(cancellationToken);

        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_context, request.UserId);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}