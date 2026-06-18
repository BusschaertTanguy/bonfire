import { createContext } from "react";
import type { User } from "@/api/auth/auth.types";

export interface AuthContextState {
    readonly user: User | null;
    readonly loadUser: () => Promise<void>;
    readonly clearSession: () => Promise<void>;
    readonly isLoading: boolean;
}

export const AuthContext = createContext<AuthContextState | null>(null);
