namespace api.Models;

public class Follow
{
    // Foreign key for the user who is following (follower)
    public string FollowerId { get; set; } = string.Empty;
    
    // Foreign key for the user being followed (followee)
    public string FolloweeId { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public User Follower { get; set; } = null!;
    public User Followee { get; set; } = null!;
}
