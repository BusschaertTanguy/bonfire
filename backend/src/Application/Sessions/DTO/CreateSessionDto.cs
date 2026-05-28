using System.ComponentModel.DataAnnotations;

namespace Application.Sessions.DTO;

public sealed record CreateSessionDto([Required] string Name);