using System.Reflection;
using Application.Common.Requests;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Common.Extensions;

public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddApplicationLayer()
        {
            return services
                .AddRequestHandlers();
        }

        private IServiceCollection AddRequestHandlers()
        {
            services.AddTransient<IRequestDispatcher, RequestDispatcher>();

            List<Type> interfaceTypes = [typeof(IRequestHandler<>), typeof(IRequestHandler<,>)];

            var handlerTypes = Assembly.GetExecutingAssembly()
                .GetTypes()
                .Where(type =>
                    type is { IsClass: true, IsAbstract: false } &&
                    type.GetInterfaces()
                        .Any(i => i.IsGenericType && interfaceTypes.Contains(i.GetGenericTypeDefinition())));

            foreach (var handlerType in handlerTypes)
            {
                var serviceInterfaces = handlerType.GetInterfaces()
                    .Where(i => i.IsGenericType && interfaceTypes.Contains(i.GetGenericTypeDefinition()));

                foreach (var serviceInterface in serviceInterfaces)
                {
                    services.AddTransient(serviceInterface, handlerType);
                }
            }

            return services;
        }
    }
}