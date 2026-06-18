using Application.Sessions.DTO;
using Application.Sessions.Services;
using Domain.Sessions.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Presentation.Constants;
using Presentation.Extensions;

namespace Presentation.Hubs;

internal sealed class JoinHub(ISessionService sessionService, IAuthorizationService authorizationService) : Hub
{
    public async Task AddJoinRequest(string sessionCode)
    {
        var userId = Context.User?.GetUserId();
        if (!userId.HasValue)
        {
            throw new InvalidOperationException("Unauthorized");
        }

        var session = await sessionService.GetActiveByCodeAsync(sessionCode);
        if (session is null)
        {
            throw new InvalidOperationException("Session not found");
        }

        var dto = new AddJoinRequestDto(userId.Value);
        await sessionService.AddJoinRequestAsync(session.Id, dto);

        var joinGroup = $"session/{session.Id}/join/{userId}";
        await Groups.AddToGroupAsync(Context.ConnectionId, joinGroup);

        var ownerGroup = $"session/{session.Id}";
        await Clients.Group(ownerGroup).SendAsync("JoinRequestAdded");
    }

    public async Task JoinSessionOwnerGroup(string sessionId)
    {
        var ownerGroup = $"session/{sessionId}";
        await Groups.AddToGroupAsync(Context.ConnectionId, ownerGroup);
    }

    public async Task ChangeJoinRequestStatus(Guid sessionId, Guid userId, JoinRequestStatus status)
    {
        var user = Context.User;
        if (user is null)
        {
            throw new InvalidOperationException("Unauthorized");
        }

        var authorizationResult = await authorizationService.AuthorizeAsync(user, sessionId, Policies.SessionOwner);
        if (!authorizationResult.Succeeded)
        {
            throw new InvalidOperationException("Forbidden");
        }

        var dto = new ChangeJoinRequestStatusDto(userId, status);
        await sessionService.ChangeJoinRequestStatus(sessionId, dto);

        var joinGroup = $"session/{sessionId}/join/{userId}";
        await Clients.Group(joinGroup).SendAsync("JoinRequestStatusChanged", sessionId, userId, status);

        var ownerGroup = $"session/{sessionId}";
        await Clients.Group(ownerGroup).SendAsync("JoinRequestStatusChanged", sessionId, userId, status);
    }
}