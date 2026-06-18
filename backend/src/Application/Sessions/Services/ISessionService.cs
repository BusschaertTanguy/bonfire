using Application.Sessions.DTO;

namespace Application.Sessions.Services;

public interface ISessionService
{
    Task<List<SessionDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<SessionDto> GetAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SessionDto?> GetActiveByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<Guid> CreateAsync(CreateSessionDto dto, CancellationToken cancellationToken = default);

    Task<List<JoinRequestDto>> GetAllJoinRequestsAsync(Guid sessionId,
        CancellationToken cancellationToken = default);

    Task AddJoinRequestAsync(Guid id, AddJoinRequestDto dto,
        CancellationToken cancellationToken = default);

    Task ChangeJoinRequestStatus(Guid id, ChangeJoinRequestStatusDto dto,
        CancellationToken cancellationToken = default);
}