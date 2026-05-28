namespace Presentation.DTO;

internal sealed record RegisterDto(string UserName, string Email, string Password);

internal sealed record LoginDto(string Email, string Password);

internal sealed record UserDto(Guid Id, string? Name);