using api.Features.User;
using MediatR;

namespace api.Features.Follow.GetSuggestions;

public record GetSuggestionsQuery : IRequest<IEnumerable<UserDto>>;
