import { HubConnectionBuilder, type HubConnection } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

const useSignalR = (
    url: string | null,
    configureMessages?: (connection: HubConnection) => void
) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const configureRef = useRef(configureMessages);

    useEffect(() => {
        configureRef.current = configureMessages;
    });

    useEffect(() => {
        let cancelled = false;

        if (!url) {
            return;
        }

        const newConnection = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();

        configureRef.current?.(newConnection);

        newConnection
            .start()
            .then(() => {
                if (cancelled) {
                    return newConnection.stop();
                }
                setConnection(newConnection);
            })
            .catch((err: unknown) => {
                console.error("Connection failed:", err);
            });

        return () => {
            cancelled = true;
            setConnection(null);
            newConnection.stop().catch((err: unknown) => {
                console.error("Failed to stop connection:", err);
            });
        };
    }, [url]);

    return connection;
};

export default useSignalR;
