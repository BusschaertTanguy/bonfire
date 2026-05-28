using Application.Data;
using Application.Sessions.Constants;
using Application.Sessions.DTO;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Services;

public sealed class SessionService(
    IApplicationDbContext dbContext,
    IUniqueConstraintDetector uniqueConstraintDetector)
{
    public async Task<List<SessionDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Select(s => new SessionDto(s.Id, s.Code, s.Name))
            .ToListAsync(cancellationToken);
    }
    
    public async Task<SessionDto> GetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.Id == id)
            .Select(s => new SessionDto(s.Id, s.Code, s.Name))
            .FirstAsync(cancellationToken);
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
}