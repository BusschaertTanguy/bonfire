using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Application.Common.Requests;

namespace Application.Sessions.Commands.CreateSession;

public sealed record CreateSessionCommand([Required] string Name) : IRequest<Guid>
{
    [JsonIgnore] public Guid OwnerId { get; init; }
}