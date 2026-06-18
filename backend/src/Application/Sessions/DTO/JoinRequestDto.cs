using Domain.Sessions.Enums;

namespace Application.Sessions.DTO;

public sealed record JoinRequestDto(Guid UserId, string? Name, JoinRequestStatus Status);