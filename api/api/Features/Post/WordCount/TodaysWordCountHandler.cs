using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.WordCount;

public class TodaysWordCountHandler
{
    private readonly AppDbContext _dbContext;
    
    public TodaysWordCountHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<int> Handle()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        
        var totalWordCount = await _dbContext.Posts
            .Where(p => p.CreatedAt >= today && p.CreatedAt < tomorrow)
            .SumAsync(p => p.WordCount);
            
        return totalWordCount;
    }
}