using System.ComponentModel.DataAnnotations;

namespace api.Features.Follow.DeleteFollow;

public class DeleteFollowQuery
{
    [Required(ErrorMessage = "Follower is required")]
    public string Follower { get; set; } = string.Empty;
    [Required(ErrorMessage = "Following is required")]
    public string Following { get; set; } = string.Empty;
}
