import { authApi } from "@/api/auth/auth.api";
import Button from "@/components/ui/button";
import NavLink from "@/components/ui/nav-link";
import { useAuth } from "@/hooks/use-auth";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Breadcrumbs from "./-components/breadcrumbs";
import type { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
    readonly userId: string | null;
    readonly authenticated: boolean;
    readonly queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    const { user, clearSession } = useAuth();

    const handleLogout = async () => {
        await authApi.logout();
        await clearSession();
    };

    return (
        <>
            <div className="flex h-dvh w-full flex-col divide-y">
                <header className="flex items-center justify-between p-3">
                    <NavLink to="/" variant="ghost">
                        Bonfire
                    </NavLink>
                    {!!user && (
                        <div className="flex items-center gap-4">
                            <span>{user.name}</span>
                            <Button onClick={handleLogout} variant="outline">
                                Logout
                            </Button>
                        </div>
                    )}
                </header>
                <main className="flex h-full w-full flex-col gap-4 p-4">
                    <Breadcrumbs />
                    <Outlet />
                </main>
            </div>
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
}
