using Microsoft.EntityFrameworkCore;

namespace Application.Common.Data;

public interface IUniqueConstraintDetector
{
    bool IsUniqueViolation(DbUpdateException exception, string? constraintName = null);
}