using Application.Common.Data;
using Application.Common.Requests;
using Application.Sessions.DTO;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Queries.GetActiveSessionByCode;

internal sealed class GetActiveSessionByCodeHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetActiveSessionByCodeQuery, SessionDto?>
{
    public async Task<SessionDto?> HandleAsync(GetActiveSessionByCodeQuery request,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.Code == request.Code && s.ClosedOn == null)
            .Select(s => new SessionDto(s.Id, s.OwnerId, s.Code, s.Name))
            .FirstOrDefaultAsync(cancellationToken);
    }
}