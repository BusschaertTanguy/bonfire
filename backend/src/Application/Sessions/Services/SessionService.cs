using Application.Data;
using Application.Sessions.Constants;
using Application.Sessions.DTO;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Services;

internal sealed class SessionService(
    IApplicationDbContext dbContext,
    IUniqueConstraintDetector uniqueConstraintDetector) : ISessionService
{
    public async Task<List<SessionDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.OwnerId == userId)
            .Select(s => new SessionDto(s.Id, s.OwnerId, s.Code, s.Name))
            .ToListAsync(cancellationToken);
    }

    public async Task<SessionDto> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.Id == id)
            .Select(s => new SessionDto(s.Id, s.OwnerId, s.Code, s.Name))
            .FirstAsync(cancellationToken);
    }

    public async Task<SessionDto?> GetActiveByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.Code == code && s.ClosedOn == null)
            .Select(s => new SessionDto(s.Id, s.OwnerId, s.Code, s.Name))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Guid> CreateAsync(CreateSessionDto dto, CancellationToken cancellationToken = default)
    {
        var id = Guid.CreateVersion7();

        const int maxAttempts = 5;

        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            try
            {
                var session = new Session
                {
                    Id = id,
                    OwnerId = dto.OwnerId,
                    Code = SessionCodeGenerator.Generate(),
                    Name = dto.Name,
                    CreatedOn = DateTimeOffset.UtcNow
                };

                await dbContext.Set<Session>().AddAsync(session, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);

                break;
            }
            catch (DbUpdateException ex)
                when (uniqueConstraintDetector.IsUniqueViolation(ex, SessionConstraints.UniqueOpenSessionCode))
            {
                if (attempt == maxAttempts - 1)
                {
                    throw;
                }
            }
        }

        return id;
    }

    public async Task<List<JoinRequestDto>> GetAllJoinRequestsAsync(Guid sessionId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext
            .Set<Session>()
            .Where(s => s.Id == sessionId)
            .SelectMany(s => s.JoinRequests)
            .Select(jr => new JoinRequestDto(jr.UserId, jr.User!.UserName, jr.Status))
            .ToListAsync(cancellationToken);
    }

    public async Task AddJoinRequestAsync(Guid id, AddJoinRequestDto dto,
        CancellationToken cancellationToken = default)
    {
        var session = await dbContext
            .Set<Session>()
            .Include(s => s.JoinRequests)
            .Where(s => s.Id == id)
            .FirstAsync(cancellationToken);

        session.AddJoinRequest(dto.UserId);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ChangeJoinRequestStatus(Guid id, ChangeJoinRequestStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        var session = await dbContext
            .Set<Session>()
            .Include(s => s.JoinRequests)
            .Where(s => s.Id == id)
            .FirstAsync(cancellationToken);

        session.ChangeJoinRequestStatus(dto.UserId, dto.Status);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}