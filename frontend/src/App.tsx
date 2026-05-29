import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { router } from "@/router";
import type { MyRouterContext } from "@/routes/__root";
import { useMemo } from "react";

function App() {
    const auth = useAuth();

    const context: MyRouterContext = useMemo(() => {
        return {
            authenticated: !!auth.user,
        };
    }, [auth.user]);

    return <RouterProvider router={router} context={context} />;
}

export default App;
