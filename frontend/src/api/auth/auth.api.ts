import apiClient from "../api-client";
import type { LoginRequest, RegisterRequest, User } from "./auth.types";

const getMe = async () => {
    return await apiClient.get<User>("/api/v1/auth/me");
};

const postRegister = async (dto: RegisterRequest) => {
    return await apiClient.post("/api/v1/auth/register", dto);
};

const postLogin = async (dto: LoginRequest) => {
    await apiClient.post("/api/v1/auth/login", dto);
    await getAntiforgeryToken();
};

const postLogout = async () => {
    await apiClient.post("/api/v1/auth/logout");
    await getAntiforgeryToken();
};

const getAntiforgeryToken = async () => {
    await apiClient.get("/api/v1/auth/antiforgery");
};

export const authApi = {
    getMe,
    postRegister,
    postLogin,
    postLogout,
    getAntiforgeryToken,
};
