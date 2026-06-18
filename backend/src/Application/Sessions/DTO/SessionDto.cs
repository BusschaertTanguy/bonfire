namespace Application.Sessions.DTO;

public sealed record SessionDto(Guid Id, Guid OwnerId, string Code, string Name);