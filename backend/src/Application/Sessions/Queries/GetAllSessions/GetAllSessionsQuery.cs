using Application.Common.Requests;
using Application.Sessions.DTO;

namespace Application.Sessions.Queries.GetAllSessions;

public sealed record GetAllSessionsQuery(Guid UserId) : IRequest<List<SessionDto>>;