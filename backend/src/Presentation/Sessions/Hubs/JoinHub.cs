using Application.Common.Requests;
using Application.Sessions.Commands.AddJoinRequest;
using Application.Sessions.Commands.ChangeJoinRequestStatus;
using Application.Sessions.Queries.GetActiveSessionByCode;
using Domain.Sessions.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Presentation.Auth.Constants;
using Presentation.Auth.Extensions;
using Presentation.Sessions.Constants;

namespace Presentation.Sessions.Hubs;

internal sealed class JoinHub(
    IRequestDispatcher dispatcher,
    IAuthorizationService authorizationService) : Hub
{
    public async Task AddJoinRequest(string sessionCode)
    {
        var userId = Context.User?.GetUserId();
        if (!userId.HasValue)
        {
            throw new InvalidOperationException("Unauthorized");
        }

        var query = new GetActiveSessionByCodeQuery(sessionCode);
        var session = await dispatcher.DispatchAsync(query, Context.ConnectionAborted);
        if (session is null)
        {
            throw new InvalidOperationException("Session not found");
        }

        var command = new AddJoinRequestCommand(session.Id, userId.Value);
        await dispatcher.DispatchAsync(command, Context.ConnectionAborted);

        var joinGroup = GetJoinGroup(session.Id, userId.Value);
        await Groups.AddToGroupAsync(Context.ConnectionId, joinGroup, Context.ConnectionAborted);

        var sessionGroup = GetSessionGroup(session.Id);
        await Clients.Group(sessionGroup).SendAsync(JoinHubMessages.JoinRequestAdded, Context.ConnectionAborted);
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

        var command = new ChangeJoinRequestStatusCommand(sessionId, userId, status);
        await dispatcher.DispatchAsync(command, Context.ConnectionAborted);

        var joinGroup = GetJoinGroup(sessionId, userId);
        await Clients.Group(joinGroup).SendAsync(JoinHubMessages.JoinRequestStatusChanged, sessionId, userId, status,
            Context.ConnectionAborted);

        var sessionGroup = GetSessionGroup(sessionId);
        await Clients.Group(sessionGroup).SendAsync(JoinHubMessages.JoinRequestAdded, sessionId, userId, status,
            Context.ConnectionAborted);
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