import { createFileRoute } from "@tanstack/react-router";
import { sessionsApi } from "../../../api/sessions/sessions.api";
import type { SessionDto } from "../../../api/sessions/sessions.types";

export const Route = createFileRoute("/_authenticated/session/$id")({
    component: RouteComponent,
    loader: async ({ params }) => {
        const response = await sessionsApi.getDetail(params.id);
        return response.data;
    },
    staticData: {
        breadcrumb: (data) => {
            const session = data as SessionDto;
            return session.name;
        },
    },
});

function RouteComponent() {
    const session = Route.useLoaderData();
    return (
        <p>
            Code: <span className="font-bold">{session.code}</span>
        </p>
    );
}
