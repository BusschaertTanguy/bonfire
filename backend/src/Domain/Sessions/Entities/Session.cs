namespace Domain.Sessions.Entities;

public sealed class Session
{
    public required Guid Id { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required DateTimeOffset CreatedOn { get; init; }
    public DateTimeOffset? ClosedOn { get; set; }
}