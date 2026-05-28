import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/session")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Session</div>;
}
