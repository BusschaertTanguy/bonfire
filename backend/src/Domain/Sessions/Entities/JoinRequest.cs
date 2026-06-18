using Domain.Sessions.Enums;
using Domain.Users.Entities;

namespace Domain.Sessions.Entities;

public sealed class JoinRequest
{
    public required Guid SessionId { get; init; }
    public required Guid UserId { get; init; }
    public required JoinRequestStatus Status { get; set; }

    public AppUser? User { get; } = null;
}