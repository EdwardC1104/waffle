namespace api.Models;

public class Like
{
    public string UserId { get; set; } = string.Empty;
    public int PostId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public User User { get; set; } = null!;
    public Post Post { get; set; } = null!;
}
