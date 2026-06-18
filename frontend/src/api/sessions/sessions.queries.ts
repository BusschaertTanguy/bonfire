import { queryOptions } from "@tanstack/react-query";
import { sessionsApi } from "./sessions.api";

export const getSessionOptions = (sessionId: string) => {
    return queryOptions({
        queryKey: ["sessions", sessionId],
        queryFn: async () => {
            const response = await sessionsApi.get(sessionId);
            return response.data;
        },
    });
};

export const getJoinRequestsOptions = (sessionId: string) => {
    return queryOptions({
        queryKey: ["sessions", sessionId, "join-requests"],
        queryFn: async () => {
            const response = await sessionsApi.getAllJoinRequests(sessionId);
            return response.data;
        },
    });
};
