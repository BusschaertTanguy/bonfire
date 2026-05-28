using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureLayer(this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Postgres");
        ArgumentNullException.ThrowIfNull(connectionString);

        services.AddDbContext<ApplicationDbContext>(builder =>
            builder.UseNpgsql(connectionString)
                .UseSnakeCaseNamingConvention());

        return services;
    }
}