using Domain.Users.Entities;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Presentation.Auth.DTO;
using Presentation.Auth.Extensions;

namespace Presentation.Auth.Routes;

internal static class AuthRoutes
{
    extension(IEndpointRouteBuilder app)
    {
        internal void MapAuthRoutes()
        {
            var group = app.MapGroup("auth");

            group.MapGet("me",
                async (HttpContext http, [FromServices] UserManager<AppUser> userManager) =>
                {
                    var id = http.User.GetUserId();

                    if (!id.HasValue)
                    {
                        return Results.Unauthorized();
                    }

                    var user = await userManager.FindByIdAsync(id.Value.ToString());

                    return user == null
                        ? Results.Unauthorized()
                        : Results.Ok(new UserDto(user.Id, user.UserName));
                });

            group.MapPost("register", async (
                [FromServices] UserManager<AppUser> userManager,
                [FromBody] RegisterDto dto) =>
            {
                var user = new AppUser
                {
                    Id = Guid.CreateVersion7(),
                    UserName = dto.UserName,
                    Email = dto.Email
                };

                var result = await userManager.CreateAsync(user, dto.Password);

                return result.Succeeded ? Results.Ok() : Results.BadRequest();
            }).AllowAnonymous();

            group.MapPost("login", async (
                [FromServices] SignInManager<AppUser> signInManager,
                [FromServices] UserManager<AppUser> userManager,
                [FromBody] LoginDto dto) =>
            {
                var user = await userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                {
                    return Results.Unauthorized();
                }

                var result = await signInManager.PasswordSignInAsync(user, dto.Password, true, false);

                return result.Succeeded ? Results.Ok() : Results.Unauthorized();
            }).AllowAnonymous();

            group.MapPost("logout", async ([FromServices] SignInManager<AppUser> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();
            });

            group.MapGet("antiforgery", ([FromServices] IAntiforgery antiforgery, HttpContext http) =>
            {
                var tokens = antiforgery.GetAndStoreTokens(http);

                http.Response.Cookies.Append(
                    "XSRF-TOKEN",
                    tokens.RequestToken!,
                    new()
                    {
                        HttpOnly = false,
                        Secure = true,
                        SameSite = SameSiteMode.Strict
                    });

                return Results.NoContent();
            }).AllowAnonymous();
        }
    }
}