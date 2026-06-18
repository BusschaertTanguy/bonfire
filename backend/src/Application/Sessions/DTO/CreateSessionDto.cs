using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Application.Sessions.DTO;

public sealed record CreateSessionDto([Required] string Name)
{
    [JsonIgnore] public Guid OwnerId { get; init; }
}