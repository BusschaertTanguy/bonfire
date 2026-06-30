using Domain.Sessions.Entities;
using Domain.Sessions.Enums;
using Infrastructure.Common.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Presentation.Auth.Extensions;

namespace Presentation.Auth.AuthorizationHandlers;

internal sealed class SessionParticipantRequirement : IAuthorizationRequirement;

internal sealed class SessionParticipantAuthorizationHandler(ApplicationDbContext dbContext)
    : AuthorizationHandler<SessionParticipantRequirement, Guid>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SessionParticipantRequirement requirement,
        Guid sessionId
    )
    {
        var userId = context.User.GetUserId();
        if (!userId.HasValue)
        {
            return;
        }

        var session = await dbContext.Set<Session>()
            .Where(s => s.Id == sessionId)
            .Select(s => new
            {
                s.OwnerId,
                ParticipantIds = s.JoinRequests.Where(jr => jr.Status == JoinRequestStatus.Approved)
                    .Select(jr => jr.UserId)
            })
            .FirstOrDefaultAsync();

        if (session is not null && (session.OwnerId == userId || session.ParticipantIds.Contains(userId.Value)))
        {
            context.Succeed(requirement);
        }
    }
}