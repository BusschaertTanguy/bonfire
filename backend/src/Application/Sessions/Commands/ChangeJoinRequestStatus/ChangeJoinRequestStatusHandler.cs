using Application.Common.Data;
using Application.Common.Requests;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Commands.ChangeJoinRequestStatus;

internal sealed class ChangeJoinRequestStatusHandler(IApplicationDbContext dbContext)
    : IRequestHandler<ChangeJoinRequestStatusCommand>
{
    public async Task HandleAsync(ChangeJoinRequestStatusCommand request, CancellationToken cancellationToken = default)
    {
        var session = await dbContext
            .Set<Session>()
            .Include(s => s.JoinRequests)
            .Where(s => s.Id == request.SessionId)
            .FirstAsync(cancellationToken);

        session.ChangeJoinRequestStatus(request.UserId, request.Status);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}