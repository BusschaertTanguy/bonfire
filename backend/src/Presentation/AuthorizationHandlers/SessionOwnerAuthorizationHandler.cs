using Domain.Sessions.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Presentation.Extensions;

namespace Presentation.AuthorizationHandlers;

internal sealed class SessionOwnerRequirement : IAuthorizationRequirement;

internal sealed class SessionOwnerAuthorizationHandler(ApplicationDbContext dbContext)
    : AuthorizationHandler<SessionOwnerRequirement, Guid>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        SessionOwnerRequirement requirement,
        Guid sessionId
    )
    {
        var userId = context.User.GetUserId();
        if (!userId.HasValue)
        {
            return;
        }

        var ownerId = await dbContext.Set<Session>()
            .Where(s => s.Id == sessionId)
            .Select(s => s.OwnerId)
            .FirstOrDefaultAsync();

        if (ownerId != Guid.Empty && ownerId == userId)
        {
            context.Succeed(requirement);
        }
    }
}