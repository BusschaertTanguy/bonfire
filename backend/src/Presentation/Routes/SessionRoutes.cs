using Application.Requests;
using Application.Sessions.Commands.CreateSession;
using Application.Sessions.Queries.GetAllJoinRequests;
using Application.Sessions.Queries.GetAllSessions;
using Application.Sessions.Queries.GetSession;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Constants;
using Presentation.Extensions;

namespace Presentation.Routes;

internal static class SessionRoutes
{
    internal static void MapSessionRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("sessions");

        group.MapGet("", async (
            HttpContext httpContext,
            [FromServices] IRequestDispatcher dispatcher,
            CancellationToken cancellationToken) =>
        {
            var userId = httpContext.User.GetUserId();
            if (!userId.HasValue)
            {
                return Results.Unauthorized();
            }

            var query = new GetAllSessionsQuery(userId.Value);
            var sessions = await dispatcher.DispatchAsync(query, cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapGet("{id:guid}", async (
            HttpContext httpContext,
            [FromServices] IAuthorizationService authorizationService,
            [FromServices] IRequestDispatcher dispatcher,
            Guid id,
            CancellationToken cancellationToken) =>
        {
            var result = await authorizationService.AuthorizeAsync(httpContext.User, id, Policies.SessionParticipant);
            if (!result.Succeeded)
            {
                return Results.Forbid();
            }

            var query = new GetSessionQuery(id);
            var sessions = await dispatcher.DispatchAsync(query, cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapGet("{id:guid}/join-requests", async (
            HttpContext httpContext,
            [FromServices] IAuthorizationService authorizationService,
            [FromServices] IRequestDispatcher dispatcher,
            Guid id,
            CancellationToken cancellationToken) =>
        {
            var result = await authorizationService.AuthorizeAsync(httpContext.User, id, Policies.SessionParticipant);
            if (!result.Succeeded)
            {
                return Results.Forbid();
            }

            var query = new GetAllJoinRequestsQuery(id);
            var sessions = await dispatcher.DispatchAsync(query, cancellationToken);

            return Results.Ok(sessions);
        });

        group.MapPost("", async (
            HttpContext httpContext,
            [FromServices] IRequestDispatcher dispatcher,
            [FromBody] CreateSessionCommand command,
            CancellationToken cancellationToken) =>
        {
            var userId = httpContext.User.GetUserId();
            if (!userId.HasValue)
            {
                return Results.Unauthorized();
            }

            command = command with
            {
                OwnerId = userId.Value
            };

            var id = await dispatcher.DispatchAsync(command, cancellationToken);
            return Results.Created($"/sessions/{id}", id);
        });
    }
}