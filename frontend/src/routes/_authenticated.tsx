import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: ({ context }) => {
        if (!context.authenticated) {
            throw redirect({
                to: "/",
            });
        }
    },
    component: AuthenticatedComponent,
});

function AuthenticatedComponent() {
    return <Outlet />;
}
