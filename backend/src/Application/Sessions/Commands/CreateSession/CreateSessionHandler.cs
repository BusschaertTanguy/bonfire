using System.Security.Cryptography;
using Application.Data;
using Application.Requests;
using Application.Sessions.Constants;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Sessions.Commands.CreateSession;

internal sealed class CreateSessionHandler(
    IApplicationDbContext dbContext,
    IUniqueConstraintDetector uniqueConstraintDetector
) : IRequestHandler<CreateSessionCommand, Guid>
{
    public async Task<Guid> HandleAsync(CreateSessionCommand command, CancellationToken cancellationToken = default)
    {
        var id = Guid.CreateVersion7();

        const int maxAttempts = 5;

        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            try
            {
                var session = new Session
                {
                    Id = id,
                    OwnerId = command.OwnerId,
                    Code = GenerateCode(),
                    Name = command.Name,
                    CreatedOn = DateTimeOffset.UtcNow
                };

                await dbContext.Set<Session>().AddAsync(session, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);

                break;
            }
            catch (DbUpdateException ex)
                when (uniqueConstraintDetector.IsUniqueViolation(ex, SessionConstraints.UniqueOpenSessionCode))
            {
                if (attempt == maxAttempts - 1)
                {
                    throw;
                }
            }
        }

        return id;
    }

    private static string GenerateCode()
    {
        const int length = 7;
        const string alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

        Span<char> chars = stackalloc char[length];
        Span<byte> random = stackalloc byte[length];

        RandomNumberGenerator.Fill(random);

        for (var i = 0; i < length; i++)
        {
            chars[i] = alphabet[random[i] % alphabet.Length];
        }

        return new(chars);
    }
}