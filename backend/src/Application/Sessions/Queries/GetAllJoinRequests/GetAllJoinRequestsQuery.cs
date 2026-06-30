using Application.Common.Requests;
using Application.Sessions.DTO;

namespace Application.Sessions.Queries.GetAllJoinRequests;

public record GetAllJoinRequestsQuery(Guid SessionId) : IRequest<List<JoinRequestDto>>;