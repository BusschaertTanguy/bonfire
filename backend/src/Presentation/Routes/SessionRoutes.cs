using Application.Sessions.DTO;
using Application.Sessions.Services;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Routes;

internal static class SessionRoutes
{
    internal static void MapSessionRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("sessions");
        
        group.MapGet("", async (
            [FromServices] SessionService service,
            CancellationToken cancellationToken) =>
        {
            var sessions = await service.GetAllAsync(cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapGet("{id:guid}", async (
            [FromServices] SessionService service,
            Guid id,
            CancellationToken cancellationToken) =>
        {
            var sessions = await service.GetAsync(id, cancellationToken);
            return Results.Ok(sessions);
        });

        group.MapPost("", async (
            [FromServices] SessionService service,
            [FromBody] CreateSessionDto dto,
            CancellationToken cancellationToken) =>
        {
            var id = await service.CreateAsync(dto, cancellationToken);
            return Results.Created($"/sessions/{id}", id);
        });
    }
}