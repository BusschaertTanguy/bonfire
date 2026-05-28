import apiClient from "../api-client";
import type { CreateSessionDto, SessionDto } from "./sessions.types";

const url = "/api/v1/sessions";

const getAll = async () => {
    return await apiClient.get<SessionDto[]>(url);
};

const getDetail = async (sessionId: string) => {
    return await apiClient.get<SessionDto>(`${url}/${sessionId}`);
};

const postCreate = async (dto: CreateSessionDto) => {
    return await apiClient.post<string>(url, dto);
};

export const sessionsApi = {
    getAll,
    getDetail,
    postCreate,
};
