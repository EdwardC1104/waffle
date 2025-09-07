using api.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace api.Features.Post.WordCount;

public class TodaysWordCountHandler : IRequestHandler<TodaysWordCountQuery, int>
{
    private readonly AppDbContext _dbContext;
    
    public TodaysWordCountHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<int> Handle(TodaysWordCountQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        
        var totalWordCount = await _dbContext.Posts
            .Where(p => p.CreatedAt >= today && p.CreatedAt < tomorrow)
            .SumAsync(p => p.WordCount, cancellationToken);
            
        return totalWordCount;
    }
}