using Infrastructure.Data;
using Infrastructure.Extensions;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Presentation.Filters;
using Presentation.Routes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddInfrastructureLayer(builder.Configuration);

builder.Services.AddProblemDetails();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddIdentityCore<AppUser>()
    .AddRoles<AppRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
});

if (builder.Environment.IsDevelopment())
{
    var reverseProxyConfig = builder.Configuration.GetSection("ReverseProxy");

    builder.Services.AddReverseProxy()
        .LoadFromConfig(reverseProxyConfig);
}

var app = builder.Build();

app.UseExceptionHandler(appBuilder =>
    appBuilder.Run(async context => await Results.Problem().ExecuteAsync(context)));

app.UseStatusCodePages(async context =>
    await Results.Problem(statusCode: context.HttpContext.Response.StatusCode).ExecuteAsync(context.HttpContext));

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

var api = app.MapGroup("api")
    .AddEndpointFilter<AntiforgeryEndpointFilter>()
    .RequireAuthorization();

var v1 = api.MapGroup("v1");

v1.MapAuthRoutes();

if (app.Environment.IsDevelopment())
{
    app.MapReverseProxy();
}
else
{
    app.MapFallbackToFile("index.html");
}

app.Run();