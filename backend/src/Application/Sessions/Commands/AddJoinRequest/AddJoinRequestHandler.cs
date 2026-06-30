using Application.Common.Data;
using Application.Common.Requests;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Commands.AddJoinRequest;

internal sealed class AddJoinRequestHandler(IApplicationDbContext dbContext) : IRequestHandler<AddJoinRequestCommand>
{
    public async Task HandleAsync(AddJoinRequestCommand request, CancellationToken cancellationToken = default)
    {
        var session = await dbContext
            .Set<Session>()
            .Include(s => s.JoinRequests)
            .Where(s => s.Id == request.SessionId)
            .FirstAsync(cancellationToken);

        session.AddJoinRequest(request.UserId);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}