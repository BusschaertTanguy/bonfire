using Domain.Sessions.Enums;

namespace Domain.Sessions.Entities;

public sealed class Session
{
    private readonly List<JoinRequest> _joinRequests = [];

    public required Guid Id { get; init; }
    public required Guid OwnerId { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required DateTimeOffset CreatedOn { get; init; }
    public DateTimeOffset? ClosedOn { get; init; }
    public IEnumerable<JoinRequest> JoinRequests => _joinRequests.AsReadOnly();

    public void AddJoinRequest(Guid userId)
    {
        if (_joinRequests.Any(s => s.UserId == userId))
        {
            throw new InvalidOperationException(
                $"Player with id {userId} has already requested to join this session");
        }

        var joinRequest = new JoinRequest
        {
            UserId = userId,
            SessionId = Id,
            Status = JoinRequestStatus.Pending
        };

        _joinRequests.Add(joinRequest);
    }

    public void ChangeJoinRequestStatus(Guid userId, JoinRequestStatus status)
    {
        var joinRequest = _joinRequests.FirstOrDefault(s => s.UserId == userId);
        if (joinRequest is null)
        {
            throw new InvalidOperationException($"Player with id {userId} has not requested to join this session");
        }

        joinRequest.Status = status;
    }
}