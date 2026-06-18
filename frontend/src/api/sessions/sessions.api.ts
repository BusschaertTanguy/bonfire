import apiClient from "@/api/api-client";
import type {
    CreateSessionDto,
    JoinRequestDto,
    SessionDto,
} from "./sessions.types";

const url = "/api/v1/sessions";

const getAll = async () => {
    return await apiClient.get<SessionDto[]>(url);
};

const get = async (sessionId: string) => {
    return await apiClient.get<SessionDto>(`${url}/${sessionId}`);
};

const create = async (dto: CreateSessionDto) => {
    return await apiClient.post<string>(url, dto);
};

const getAllJoinRequests = async (sessionId: string) => {
    return await apiClient.get<JoinRequestDto[]>(
        `${url}/${sessionId}/join-requests`
    );
};

export const sessionsApi = {
    getAll,
    get,
    create,
    getAllJoinRequests,
};
