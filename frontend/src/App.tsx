import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { router } from "@/router";
import type { MyRouterContext } from "@/routes/__root";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

function App() {
    const auth = useAuth();
    const queryClient = useQueryClient();

    const context: MyRouterContext = useMemo(() => {
        return {
            userId: auth.user?.id ?? null,
            authenticated: !!auth.user,
            queryClient,
        };
    }, [auth.user, queryClient]);

    return <RouterProvider router={router} context={context} />;
}

export default App;
