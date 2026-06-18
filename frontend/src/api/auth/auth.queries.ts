import { queryOptions } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import type { User } from "./auth.types";

export const meOptions = () => {
    return queryOptions<User | null>({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const response = await authApi.me();
            return response.data;
        },
    });
};
