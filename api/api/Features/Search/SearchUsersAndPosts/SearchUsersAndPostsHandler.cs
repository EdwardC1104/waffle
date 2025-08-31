using api.Data;
using api.Features.Post;
using api.Features.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Search.SearchUsersAndPosts;


public class SearchUsersAndPostsHandler
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<api.Models.User> _userManager;
    
    public SearchUsersAndPostsHandler(AppDbContext dbContext, UserManager<api.Models.User> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }
    
    public async Task<SearchUsersAndPostsResponse> Handle(SearchUsersAndPostsQuery query)
    {
        // Fetch posts including user
        var postsEntities = await _dbContext.Posts
            .ToListAsync(); // fetch first

        // Map to DTOs asynchronously
        var posts = new List<PostDto>();
        foreach (var post in postsEntities)
        {
            posts.Add(await post.ToDtoAsync(_dbContext));
        }

        return new SearchUsersAndPostsResponse
        {
            Users = [],
            Posts = posts
        };
    }
    
    public async Task<SearchUsersAndPostsResponse> Handle(string username, SearchUsersAndPostsQuery query)
    {
        var posts = await _dbContext.Posts.Where(p => EF.Functions.ToTsVector("english", p.Title + " " + p.Content)
                .Matches(query.Query))
            .Include(p => p.User)
            .ToListAsync();

        var postDtos = new List<PostDto>();
        foreach (var post in posts)
        {
            var postDto = await post.ToDtoAsync(username, _dbContext);
            postDtos.Add(postDto);
        }
        
        var users = await _dbContext.Users.Where(u => EF.Functions.ToTsVector("english", u.Name + " " + u.UserName)
                .Matches(query.Query))
            .ToListAsync();
        
        var userDtos = new List<UserDto>();
        foreach (var user in users)
        {
            var userDto = await user.ToDtoAsync(_dbContext);
            userDtos.Add(userDto);
        }

        return new SearchUsersAndPostsResponse
        {
            Users = userDtos,
            Posts = postDtos
        };
    }
}