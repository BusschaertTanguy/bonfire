import axios from "axios";

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
    const antiforgeryToken = document.cookie
        .split("; ")
        .find((x) => x.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

    if (antiforgeryToken) {
        config.headers["X-XSRF-TOKEN"] = antiforgeryToken;
    }
    return config;
});

let onUnauthenticated: (() => void) | null = null;

export const setOnUnauthenticated = (callback: (() => void) | null) => {
    onUnauthenticated = callback;
};

apiClient.interceptors.response.use(
    (response) => response,
    (error: Error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            onUnauthenticated?.();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
