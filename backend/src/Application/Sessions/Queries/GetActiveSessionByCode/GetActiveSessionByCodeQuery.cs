using Application.Requests;
using Application.Sessions.DTO;

namespace Application.Sessions.Queries.GetActiveSessionByCode;

public sealed record GetActiveSessionByCodeQuery(string Code) : IRequest<SessionDto?>;