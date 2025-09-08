using api.Data;
using api.Features.Post;
using api.Features.User;
using api.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Search.SearchUsersAndPosts;

public class SearchUsersAndPostsHandler : IRequestHandler<SearchUsersAndPostsQuery, SearchUsersAndPostsResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<api.Models.User> _userManager;
    private readonly CurrentUserService _currentUserService;
    
    public SearchUsersAndPostsHandler(AppDbContext dbContext, UserManager<api.Models.User> userManager, CurrentUserService currentUserService)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _currentUserService = currentUserService;
    }
    
    public async Task<SearchUsersAndPostsResponse> Handle(SearchUsersAndPostsQuery query, CancellationToken cancellationToken)
    {
        var posts = await _dbContext.Posts.Where(p => EF.Functions.ToTsVector("english", p.Title + " " + p.Content)
            .Matches(EF.Functions.PlainToTsQuery("english", query.Query)))
            .Include(p => p.User)
            .ToListAsync(cancellationToken);
        
        var userId = _currentUserService.GetUserIdOrNull();

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(_dbContext, userId);
            postDtos.Add(postDto);
        }
        
        var users = await _dbContext.Users.Where(u => EF.Functions.ToTsVector("english", u.Name + " " + u.UserName)
            .Matches(EF.Functions.PlainToTsQuery("english", query.Query)))
            .ToListAsync(cancellationToken);
        
        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_dbContext, userId);
            userDtos.Add(userDto);
        }

        return new SearchUsersAndPostsResponse
        {
            Users = userDtos,
            Posts = postDtos
        };
    }
}