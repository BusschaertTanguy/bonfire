using Microsoft.AspNetCore.Identity;

namespace Domain.Users.Entities;

public sealed class AppUser : IdentityUser<Guid>;