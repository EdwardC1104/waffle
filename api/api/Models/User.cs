using Microsoft.AspNetCore.Identity;

namespace api.Models;

public class User: IdentityUser
{
    public string Name { get; set; } = string.Empty;
    
    public string ProfilePictureUrl { get; set; } = string.Empty;
    
    public ICollection<Post> Posts { get; set; } = new List<Post>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
