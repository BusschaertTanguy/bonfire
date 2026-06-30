using Application.Requests;

namespace Application.Sessions.Commands.AddJoinRequest;

public sealed record AddJoinRequestCommand(Guid SessionId, Guid UserId) : IRequest;