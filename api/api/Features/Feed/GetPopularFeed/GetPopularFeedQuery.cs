using api.Features.Post;
using MediatR;

namespace api.Features.Feed.GetPopularFeed;

public record GetPopularFeedQuery : IRequest<IEnumerable<PostDto>>;
