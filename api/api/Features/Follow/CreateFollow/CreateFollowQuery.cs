using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.CreateFollow;

public class CreateFollowQuery
{
    [Required(ErrorMessage = "Follower is required")]
    public string Follower { get; set; } = string.Empty;
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
}