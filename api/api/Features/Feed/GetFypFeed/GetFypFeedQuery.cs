using api.Features.Post;
using MediatR;

namespace api.Features.Feed.GetFypFeed;

public record GetFypFeedQuery : IRequest<IEnumerable<PostDto>>;
