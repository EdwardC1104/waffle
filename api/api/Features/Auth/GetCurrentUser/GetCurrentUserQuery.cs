using api.Features.User;
using MediatR;

namespace api.Features.Auth.GetCurrentUser;

public record GetCurrentUserQuery(string UserId) : IRequest<UserDto>;
