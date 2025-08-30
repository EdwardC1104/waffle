using Microsoft.AspNetCore.Identity;

namespace api.Models;

public class User: IdentityUser
{
    public string Name { get; set; } = string.Empty;
    
    // Navigation property for Posts - one user can have many posts
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}
