using Domain.Sessions.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

internal sealed class JoinRequestConfiguration : IEntityTypeConfiguration<JoinRequest>
{
    public void Configure(EntityTypeBuilder<JoinRequest> builder)
    {
        builder.HasKey(s => new { s.SessionId, PlayerId = s.UserId });

        builder.HasOne(s => s.User)
            .WithMany()
            .IsRequired()
            .HasForeignKey(s => s.UserId);
    }
}