using Application.Common.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Infrastructure.Common.Data;

internal sealed class PostgresUniqueConstraintDetector : IUniqueConstraintDetector
{
    public bool IsUniqueViolation(DbUpdateException exception, string? constraintName = null)
    {
        if (exception.InnerException is not PostgresException pgEx)
        {
            return false;
        }

        if (pgEx.SqlState != PostgresErrorCodes.UniqueViolation)
        {
            return false;
        }

        return constraintName is null || pgEx.ConstraintName == constraintName;
    }
}