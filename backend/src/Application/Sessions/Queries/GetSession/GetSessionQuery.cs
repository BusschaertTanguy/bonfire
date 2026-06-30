using Application.Common.Requests;
using Application.Sessions.DTO;

namespace Application.Sessions.Queries.GetSession;

public sealed record GetSessionQuery(Guid Id) : IRequest<SessionDto>;