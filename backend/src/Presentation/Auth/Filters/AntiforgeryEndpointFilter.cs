using Microsoft.AspNetCore.Antiforgery;

namespace Presentation.Auth.Filters;

public class AntiforgeryEndpointFilter(IAntiforgery antiforgery) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        if (HttpMethods.IsGet(context.HttpContext.Request.Method) ||
            HttpMethods.IsHead(context.HttpContext.Request.Method) ||
            HttpMethods.IsOptions(context.HttpContext.Request.Method))
        {
            return await next(context);
        }

        await antiforgery.ValidateRequestAsync(context.HttpContext);
        return await next(context);
    }
}