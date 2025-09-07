using System.ComponentModel.DataAnnotations;
using MediatR;

namespace api.Features.Search.SearchUsersAndPosts;

public record SearchUsersAndPostsQuery : IRequest<SearchUsersAndPostsResponse>
{
    [Required(ErrorMessage = "Query is required")]
    public string Query { get; set; } = string.Empty;
}