using Domain.Sessions.Enums;

namespace Application.Sessions.DTO;

public sealed record ChangeJoinRequestStatusDto(Guid UserId, JoinRequestStatus Status);