using System.Text.Json.Serialization;
using Application.Extensions;
using Domain.Users.Entities;
using Infrastructure.Data;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Presentation.AuthorizationHandlers;
using Presentation.Constants;
using Presentation.Filters;
using Presentation.Hubs;
using Presentation.Routes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services
    .AddApplicationLayer()
    .AddInfrastructureLayer(builder.Configuration);

builder.Services.AddProblemDetails();
builder.Services.AddValidation();

builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(Policies.SessionOwner, policy => policy.AddRequirements(new SessionOwnerRequirement()))
    .AddPolicy(Policies.SessionParticipant, policy => policy.AddRequirements(new SessionParticipantRequirement()));

builder.Services.AddScoped<IAuthorizationHandler, SessionOwnerAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, SessionParticipantAuthorizationHandler>();

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

builder.Services.AddAntiforgery(options => { options.HeaderName = "X-XSRF-TOKEN"; });

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddSignalR()
    .AddJsonProtocol(options => { options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });

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

app.MapHub<JoinHub>("/join")
    .RequireAuthorization();

var api = app.MapGroup("api")
    .AddEndpointFilter<AntiforgeryEndpointFilter>()
    .RequireAuthorization();

var v1 = api.MapGroup("v1");

v1.MapAuthRoutes();
v1.MapSessionRoutes();

if (app.Environment.IsDevelopment())
{
    app.MapReverseProxy();
}
else
{
    app.MapFallbackToFile("index.html");
}

app.Run();