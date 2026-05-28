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

export default apiClient;
