using System.Security.Cryptography;

namespace Application.Sessions.Services;

internal static class SessionCodeGenerator
{
    private const string Alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

    public static string Generate(int length = 7)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(length);

        Span<char> chars = stackalloc char[length];
        Span<byte> random = stackalloc byte[length];

        RandomNumberGenerator.Fill(random);

        for (var i = 0; i < length; i++)
        {
            chars[i] = Alphabet[random[i] % Alphabet.Length];
        }

        return new(chars);
    }
}