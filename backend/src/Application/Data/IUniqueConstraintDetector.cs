using Microsoft.EntityFrameworkCore;

namespace Application.Data;

public interface IUniqueConstraintDetector
{
    bool IsUniqueViolation(DbUpdateException exception, string? constraintName = null);
}