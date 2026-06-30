using Application.Data;
using Application.Requests;
using Application.Sessions.DTO;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Queries.GetAllJoinRequests;

internal sealed class GetAllJoinRequestsHandler(IApplicationDbContext dbContext)
    : IRequestHandler<GetAllJoinRequestsQuery, List<JoinRequestDto>>
{
    public async Task<List<JoinRequestDto>> HandleAsync(GetAllJoinRequestsQuery request,
        CancellationToken cancellationToken = default)
    {
        return await dbContext
            .Set<Session>()
            .Where(s => s.Id == request.SessionId)
            .SelectMany(s => s.JoinRequests)
            .Select(jr => new JoinRequestDto(jr.UserId, jr.User!.UserName, jr.Status))
            .ToListAsync(cancellationToken);
    }
}