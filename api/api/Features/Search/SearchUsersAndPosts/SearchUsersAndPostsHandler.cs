using api.Data;
using api.Features.Post;
using api.Features.User;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Search.SearchUsersAndPosts;

public class SearchUsersAndPostsHandler : IRequestHandler<SearchUsersAndPostsQuery, SearchUsersAndPostsResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<api.Models.User> _userManager;
    
    public SearchUsersAndPostsHandler(AppDbContext dbContext, UserManager<api.Models.User> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }
    
    public async Task<SearchUsersAndPostsResponse> Handle(SearchUsersAndPostsQuery query, CancellationToken cancellationToken)
    {
        var posts = await _dbContext.Posts.Where(p => EF.Functions.ToTsVector("english", p.Title + " " + p.Content)
            .Matches(EF.Functions.PlainToTsQuery("english", query.Query)))
            .Include(p => p.User)
            .ToListAsync(cancellationToken);

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(_dbContext, query.AuthenticatedUserId);
            postDtos.Add(postDto);
        }
        
        var users = await _dbContext.Users.Where(u => EF.Functions.ToTsVector("english", u.Name + " " + u.UserName)
            .Matches(EF.Functions.PlainToTsQuery("english", query.Query)))
            .ToListAsync(cancellationToken);
        
        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_dbContext, query.AuthenticatedUserId);
            userDtos.Add(userDto);
        }

        return new SearchUsersAndPostsResponse
        {
            Users = userDtos,
            Posts = postDtos
        };
    }
}