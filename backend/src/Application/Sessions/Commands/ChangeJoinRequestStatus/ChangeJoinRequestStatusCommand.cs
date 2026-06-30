using Application.Requests;
using Domain.Sessions.Enums;

namespace Application.Sessions.Commands.ChangeJoinRequestStatus;

public sealed record ChangeJoinRequestStatusCommand(Guid SessionId, Guid UserId, JoinRequestStatus Status) : IRequest;