using System.ComponentModel.DataAnnotations;

namespace api.Features.Search.SearchUsersAndPosts;

public class SearchUsersAndPostsQuery
{
    [Required(ErrorMessage = "Query is required")]
    public string Query { get; set; } = string.Empty;
}