using api.Data;
using api.Features.User;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetFollowing;

public class GetFollowingHandler : IRequestHandler<GetFollowingQuery, IEnumerable<UserDto>>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public GetFollowingHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetFollowingQuery query, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetUserIdOrNull();
        
        var followedUsers = await _context.Follows
            .Where(f => f.Follower.UserName == query.Username)
            .Include(f => f.Followee)
            .Select(f => f.Followee)
            .ToListAsync(cancellationToken);

        var userDtos = new List<UserDto>();
        foreach (var user in followedUsers)
        {
            var userDto = await user.ToDtoAsync(_context, userId);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}
