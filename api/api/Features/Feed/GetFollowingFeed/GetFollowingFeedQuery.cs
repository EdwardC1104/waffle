using api.Features.Post;
using MediatR;

namespace api.Features.Feed.GetFollowingFeed;

public record GetFollowingFeedQuery : IRequest<IEnumerable<PostDto>>;
