using Microsoft.Extensions.DependencyInjection;

namespace Application.Common.Requests;

internal sealed class RequestDispatcher(IServiceProvider serviceProvider) : IRequestDispatcher
{
    public async Task DispatchAsync(IRequest request, CancellationToken cancellationToken = default)
    {
        var handlerType = typeof(IRequestHandler<>).MakeGenericType(request.GetType());
        var handler = serviceProvider.GetRequiredService(handlerType);
        var method = handlerType.GetMethod(nameof(IRequestHandler<>.HandleAsync));

        if (method?.Invoke(handler, [request, cancellationToken]) is not Task task)
        {
            throw new InvalidOperationException($"Handler for {request.GetType().Name} did not return a Task");
        }

        await task;
    }

    public async Task<TResponse> DispatchAsync<TResponse>(IRequest<TResponse> request,
        CancellationToken cancellationToken = default)
    {
        var handlerType = typeof(IRequestHandler<,>).MakeGenericType(request.GetType(), typeof(TResponse));
        var handler = serviceProvider.GetRequiredService(handlerType);
        var method = handlerType.GetMethod(nameof(IRequestHandler<,>.HandleAsync));

        if (method?.Invoke(handler, [request, cancellationToken]) is not Task<TResponse> task)
        {
            throw new InvalidOperationException(
                $"Handler for {request.GetType().Name} did not return a Task<{typeof(TResponse).Name}>");
        }

        var result = await task;
        return result;
    }
}