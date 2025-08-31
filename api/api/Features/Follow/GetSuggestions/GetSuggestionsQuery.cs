using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.GetSuggestions;

public class GetSuggestionsQuery
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
}