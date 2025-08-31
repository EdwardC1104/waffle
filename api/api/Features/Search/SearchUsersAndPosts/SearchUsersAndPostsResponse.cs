using api.Features.Post;
using api.Features.User;

namespace api.Features.Search.SearchUsersAndPosts;

public class SearchUsersAndPostsResponse
{
    public List<UserDto> Users { get; set; } = [];
    public List<PostDto> Posts { get; set; } = [];
}