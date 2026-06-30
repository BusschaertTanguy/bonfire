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

        var joinGroup = GetJoinGroup(session.Id, userId.Value);
        await Groups.AddToGroupAsync(Context.ConnectionId, joinGroup);

        var sessionGroup = GetSessionGroup(session.Id);
        await Clients.Group(sessionGroup).SendAsync(JoinHubMessages.JoinRequestAdded);
    }

    public async Task JoinSession(Guid sessionId)
    {
        var user = Context.User;
        if (user is null)
        {
            throw new InvalidOperationException("Unauthorized");
        }

        var authorizationResult =
            await authorizationService.AuthorizeAsync(user, sessionId, Policies.SessionParticipant);
        
        if (!authorizationResult.Succeeded)
        {
            throw new InvalidOperationException("Forbidden");
        }

        var sessionGroup = GetSessionGroup(sessionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionGroup);
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

        var joinGroup = GetJoinGroup(sessionId, userId);
        await Clients.Group(joinGroup).SendAsync(JoinHubMessages.JoinRequestStatusChanged, sessionId, userId, status);

        var sessionGroup = GetSessionGroup(sessionId);
        await Clients.Group(sessionGroup).SendAsync(JoinHubMessages.JoinRequestAdded, sessionId, userId, status);
    }

    private static string GetJoinGroup(Guid sessionId, Guid userId)
    {
        return $"session/{sessionId}/join/{userId}";
    }
    
    private static string GetSessionGroup(Guid sessionId)
    {
        return $"session/{sessionId}";
    }
}