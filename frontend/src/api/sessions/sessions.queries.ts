import { queryOptions } from "@tanstack/react-query";
import { sessionsApi } from "./sessions.api";

export const getJoinRequestsOptions = (sessionId: string) => {
    return queryOptions({
        queryKey: ["sessions", sessionId, "join-requests"],
        queryFn: async () => {
            const response = await sessionsApi.getAllJoinRequests(sessionId);
            return response.data;
        },
    });
};
