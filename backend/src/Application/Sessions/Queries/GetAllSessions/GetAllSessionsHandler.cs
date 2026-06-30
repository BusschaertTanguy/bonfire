using Application.Common.Data;
using Application.Common.Requests;
using Application.Sessions.DTO;
using Domain.Sessions.Entities;
using Domain.Sessions.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Queries.GetAllSessions;

internal sealed class GetAllSessionsHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetAllSessionsQuery, List<SessionDto>>
{
    public async Task<List<SessionDto>> HandleAsync(GetAllSessionsQuery request,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.OwnerId == request.UserId ||
                        s.JoinRequests.Any(jr =>
                            jr.UserId == request.UserId && jr.Status == JoinRequestStatus.Approved))
            .Select(s => new SessionDto(s.Id, s.OwnerId, s.Code, s.Name))
            .ToListAsync(cancellationToken);
    }
}