using MediatR;

namespace api.Features.Post.WordCount;

public record TodaysWordCountQuery : IRequest<int>;
