using Application.Sessions.DTO;
using Application.Sessions.Services;
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
            [FromServices] ISessionService service,
            CancellationToken cancellationToken) =>
        {
            var userId = httpContext.User.GetUserId();
            if (!userId.HasValue)
            {
                return Results.Unauthorized();
            }

            var sessions = await service.GetAllAsync(userId.Value, cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapGet("{id:guid}", async (
            HttpContext httpContext,
            [FromServices] IAuthorizationService authorizationService,
            [FromServices] ISessionService service,
            Guid id,
            CancellationToken cancellationToken) =>
        {
            var result = await authorizationService.AuthorizeAsync(httpContext.User, id, Policies.SessionOwner);
            if (!result.Succeeded)
            {
                return Results.Forbid();
            }

            var sessions = await service.GetAsync(id, cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapGet("{id:guid}/join-requests", async (
            HttpContext httpContext,
            [FromServices] IAuthorizationService authorizationService,
            [FromServices] ISessionService service,
            Guid id,
            CancellationToken cancellationToken) =>
        {
            var result = await authorizationService.AuthorizeAsync(httpContext.User, id, Policies.SessionOwner);
            if (!result.Succeeded)
            {
                return Results.Forbid();
            }

            var sessions = await service.GetAllJoinRequestsAsync(id, cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapPost("", async (
            HttpContext httpContext,
            [FromServices] ISessionService service,
            [FromBody] CreateSessionDto dto,
            CancellationToken cancellationToken) =>
        {
            var userId = httpContext.User.GetUserId();
            if (!userId.HasValue)
            {
                return Results.Unauthorized();
            }

            dto = dto with
            {
                OwnerId = userId.Value
            };

            var id = await service.CreateAsync(dto, cancellationToken);
            return Results.Created($"/sessions/{id}", id);
        });
    }
}