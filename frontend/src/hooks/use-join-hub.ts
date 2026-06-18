import type { JoinRequestStatus } from "@/api/sessions/sessions.types";
import useSignalR from "./use-signalr";

interface UseJoinHubOptions {
    onJoinRequestAdded?: () => void | Promise<void>;
    onJoinRequestStatusChanged?: (
        sessionId: string,
        userId: string,
        status: JoinRequestStatus
    ) => void | Promise<void>;
}

const useJoinHub = (options: UseJoinHubOptions) => {
    const connection = useSignalR("/join", (c) => {
        if (options.onJoinRequestAdded) {
            c.on("JoinRequestAdded", options.onJoinRequestAdded);
        }

        if (options.onJoinRequestStatusChanged) {
            c.on(
                "JoinRequestStatusChanged",
                options.onJoinRequestStatusChanged
            );
        }
    });

    const addJoinRequest = async (code: string) => {
        await connection?.send("AddJoinRequest", code);
    };

    const joinSessionOwnerGroup = async (id: string) => {
        await connection?.send("JoinSessionOwnerGroup", id);
    };

    const changeJoinRequestStatus = async (
        sessionId: string,
        userId: string,
        status: JoinRequestStatus
    ) => {
        await connection?.send(
            "ChangeJoinRequestStatus",
            sessionId,
            userId,
            status
        );
    };

    return {
        addJoinRequest,
        joinSessionOwnerGroup,
        changeJoinRequestStatus,
    };
};

export default useJoinHub;
