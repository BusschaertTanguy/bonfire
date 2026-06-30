using Application.Sessions.Constants;
using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Sessions.Configurations;

internal sealed class SessionConfiguration : IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .ValueGeneratedNever();

        builder.Property(s => s.Name)
            .IsRequired();

        builder.Property(s => s.Code)
            .IsRequired();

        builder.Property(s => s.CreatedOn)
            .IsRequired();

        builder.HasIndex(s => s.Code)
            .HasDatabaseName(SessionConstraints.UniqueOpenSessionCode)
            .IsUnique()
            .HasFilter("\"closed_on\" IS NULL");

        builder.HasMany(s => s.JoinRequests)
            .WithOne()
            .HasForeignKey(jr => jr.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}