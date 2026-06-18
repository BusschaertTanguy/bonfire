import { setOnUnauthenticated } from "@/api/api-client";
import { meOptions } from "@/api/auth/auth.queries";
import { AuthContext } from "@/contexts/auth-context";
import { router } from "@/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, type PropsWithChildren } from "react";

export const AuthProvider = (props: PropsWithChildren) => {
    const queryClient = useQueryClient();
    const { data, refetch, isLoading } = useQuery(meOptions());

    const clearSession = useCallback(async () => {
        queryClient.setQueryData(meOptions().queryKey, null);
        await router.navigate({ to: "/" });
    }, [queryClient]);

    const value = useMemo(() => {
        return {
            user: data ?? null,
            loadUser: async () => {
                await refetch();
            },
            clearSession,
            isLoading,
        };
    }, [data, refetch, clearSession, isLoading]);

    useEffect(() => {
        setOnUnauthenticated(async () => {
            await clearSession();
        });
        return () => {
            setOnUnauthenticated(null);
        };
    }, [clearSession]);

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};
