import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/session")({
    component: RouteComponent,
    staticData: { breadcrumb: "Sessions" },
});

function RouteComponent() {
    return <Outlet />;
}
