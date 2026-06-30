using Application.Common.Data;
using Application.Common.Requests;
using Application.Sessions.DTO;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Queries.GetSession;

internal sealed class GetSessionHandler(IApplicationDbContext dbContext) : IRequestHandler<GetSessionQuery, SessionDto>
{
    public async Task<SessionDto> HandleAsync(GetSessionQuery request, CancellationToken cancellationToken = default)
    {
        return await dbContext.Set<Session>()
            .Where(s => s.Id == request.Id)
            .Select(s => new SessionDto(s.Id, s.OwnerId, s.Code, s.Name))
            .FirstAsync(cancellationToken);
    }
}