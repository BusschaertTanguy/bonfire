import { createFileRoute, Link } from "@tanstack/react-router";
import { sessionsApi } from "../../../api/sessions/sessions.api";

export const Route = createFileRoute("/_authenticated/session/")({
    component: RouteComponent,
    loader: async () => {
        const response = await sessionsApi.getAll();
        return response.data;
    },
});

function RouteComponent() {
    const sessions = Route.useLoaderData();

    return (
        <table className="table-auto border-collapse border">
            <thead>
                <tr>
                    <th className="w-20 border p-2">
                        <Link to="/session/create">New</Link>
                    </th>
                    <th className="border p-2">Code</th>
                    <th className="border p-2">Name</th>
                </tr>
            </thead>
            <tbody>
                {sessions.map((session) => (
                    <tr key={session.id}>
                        <td className="border p-2 text-center">
                            <Link
                                to={"/session/$id"}
                                params={{ id: session.id }}
                            >
                                Detail
                            </Link>
                        </td>
                        <td className="border p-2">{session.code}</td>
                        <td className="border p-2">{session.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
