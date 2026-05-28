import {
    createRootRouteWithContext,
    Link,
    Outlet,
    useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
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
    const router = useRouter();
    const navigate = Route.useNavigate();

    const handleLogout = async () => {
        await authApi.postLogout();
        clearUser();

        await router.invalidate();
        await navigate({ to: "/" });
    };

    return (
        <>
            <div className="flex h-dvh w-full flex-col divide-y">
                <nav className="flex items-center justify-between p-3">
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
                </nav>
                <main className="h-full w-full p-4">
                    <Outlet />
                </main>
            </div>
            <TanStackRouterDevtools />
        </>
    );
}
