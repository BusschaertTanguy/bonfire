namespace Application.Requests;

public interface IRequestDispatcher
{
    Task DispatchAsync(IRequest request, CancellationToken cancellationToken = default);

    Task<TResponse> DispatchAsync<TResponse>(IRequest<TResponse> request,
        CancellationToken cancellationToken = default);
}