using api.Data;
using api.Features.User;
using api.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Follow.GetFollowers;

public class GetFollowersHandler : IRequestHandler<GetFollowersQuery, IEnumerable<UserDto>>
{
    private readonly AppDbContext _context;
    private readonly CurrentUserService _currentUserService;

    public GetFollowersHandler(AppDbContext context, CurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetFollowersQuery query, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.GetUserIdOrNull();
        
        var followerUsers = await _context.Follows
            .Where(f => f.Followee.UserName == query.Username)
            .Include(f => f.Follower)
            .Select(f => f.Follower)
            .ToListAsync(cancellationToken);

        var userDtos = new List<UserDto>();
        foreach (var user in followerUsers)
        {
            var userDto = await user.ToDtoAsync(_context, userId);
            userDtos.Add(userDto);
        }

        return userDtos;
    }
}