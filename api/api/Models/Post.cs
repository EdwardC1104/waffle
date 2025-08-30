using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Post
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Foreign key for User relationship - using string to match IdentityUser.Id
    public string UserId { get; set; } = string.Empty;
    
    // Navigation property to User
    public User User { get; set; } = null!;
}