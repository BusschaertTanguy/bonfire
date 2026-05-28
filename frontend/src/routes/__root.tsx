import {
    createRootRouteWithContext,
    Link,
    Outlet,
    useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useMemo } from "react";
import { authApi } from "../api/auth/auth.api";
import { useAuth } from "../hooks/use-auth";

export interface MyRouterContext {
    readonly authenticated: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    const { user, clearUser } = useAuth();
    const navigate = Route.useNavigate();

    const matches = useRouterState({ select: (s) => s.matches });

    const crumbs = useMemo(
        () =>
            matches
                .filter((match) => match.staticData.breadcrumb)
                .map((match) => {
                    const label =
                        typeof match.staticData.breadcrumb === "function"
                            ? match.staticData.breadcrumb(match.loaderData)
                            : match.staticData.breadcrumb;

                    return { label, path: match.pathname };
                }),
        [matches]
    );

    const handleLogout = async () => {
        await authApi.postLogout();
        clearUser();
        await navigate({ to: "/" });
    };

    return (
        <>
            <div className="flex h-dvh w-full flex-col divide-y">
                <header className="flex items-center justify-between p-3">
                    <Link to="/">Bonfire</Link>
                    {!!user && (
                        <div className="flex items-center gap-4">
                            <span>{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer rounded border px-4 py-1"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </header>
                <main className="flex h-full w-full flex-col gap-4 p-4">
                    <nav className="flex gap-1">
                        {crumbs.map((crumb, i) => (
                            <span
                                key={crumb.path}
                                className="flex items-center gap-1"
                            >
                                <Link to={crumb.path}>{crumb.label}</Link>
                                {i < crumbs.length - 1 && <span>/</span>}
                            </span>
                        ))}
                    </nav>
                    <Outlet />
                </main>
            </div>
            <TanStackRouterDevtools />
        </>
    );
}
