using Application.Common.Data;
using Infrastructure.Common.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Common.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddInfrastructureLayer(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("Postgres");
            ArgumentNullException.ThrowIfNull(connectionString);

            services.AddDbContext<ApplicationDbContext>(builder =>
                builder.UseNpgsql(connectionString)
                    .UseSnakeCaseNamingConvention());

            services.AddTransient<IApplicationDbContext, ApplicationDbContext>();
            services.AddTransient<IUniqueConstraintDetector, PostgresUniqueConstraintDetector>();

            return services;
        }
    }
}