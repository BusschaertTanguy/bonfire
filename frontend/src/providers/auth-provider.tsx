import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import { authApi } from "../api/auth/auth.api";
import type { User } from "../api/auth/auth.types";
import { AuthContext } from "../contexts/auth-context";

export const AuthProvider = (props: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null);

    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    const loadUser = useCallback(async () => {
        try {
            const userResponse = await authApi.getMe();
            setUser(userResponse.data);
        } catch {
            setUser(null);
        }
    }, []);

    const value = useMemo(() => {
        return {
            user,
            loadUser,
            clearUser,
        };
    }, [user, loadUser, clearUser]);

    useEffect(() => {
        const authenticate = async () => {
            await loadUser();
        };

        void authenticate();
    }, [loadUser]);

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};
