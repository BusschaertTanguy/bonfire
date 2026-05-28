import apiClient from "../api-client";
import type { LoginRequest, RegisterRequest, User } from "./auth.types";

const url = "/api/v1/auth";

const getMe = async () => {
    return await apiClient.get<User>(`${url}/me`);
};

const postRegister = async (dto: RegisterRequest) => {
    return await apiClient.post(`${url}/register`, dto);
};

const postLogin = async (dto: LoginRequest) => {
    await apiClient.post(`${url}/login`, dto);
    await getAntiforgeryToken();
};

const postLogout = async () => {
    await apiClient.post(`${url}/logout`);
    await getAntiforgeryToken();
};

const getAntiforgeryToken = async () => {
    await apiClient.get(`${url}/antiforgery`);
};

export const authApi = {
    getMe,
    postRegister,
    postLogin,
    postLogout,
    getAntiforgeryToken,
};
