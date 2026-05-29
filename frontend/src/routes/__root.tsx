import { authApi } from "@/api/auth/auth.api";
import Button from "@/components/ui/button";
import NavLink from "@/components/ui/nav-link";
import { useAuth } from "@/hooks/use-auth";
import {
    createRootRouteWithContext,
    Outlet,
    useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

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
        await authApi.logout();
        clearUser();
        await navigate({ to: "/" });
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
                    <nav className="flex items-center gap-2">
                        {crumbs.map((crumb, i) => (
                            <span
                                key={crumb.path}
                                className="flex items-center gap-2"
                            >
                                <span key={crumb.path}>
                                    <NavLink to={crumb.path} size="sm">
                                        {crumb.label}
                                    </NavLink>
                                </span>
                                {i < crumbs.length - 1 && (
                                    <ChevronRight className="size-3.5" />
                                )}
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
