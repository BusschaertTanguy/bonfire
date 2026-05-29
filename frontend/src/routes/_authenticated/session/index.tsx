import { sessionsApi } from "@/api/sessions/sessions.api";
import NavLink from "@/components/ui/nav-link";
import Table from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlus, Eye } from "lucide-react";

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
        <Table.Root>
            <Table.Head>
                <Table.HeadCell className="w-12 text-center">
                    <NavLink to="/session/create" variant="icon">
                        <CirclePlus />
                    </NavLink>
                </Table.HeadCell>
                <Table.HeadCell>Code</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
            </Table.Head>
            <Table.Body>
                {sessions.map((session) => (
                    <Table.Row key={session.id}>
                        <Table.RowCell className="text-center">
                            <NavLink
                                to={"/session/$id"}
                                params={{ id: session.id }}
                                variant="icon"
                            >
                                <Eye />
                            </NavLink>
                        </Table.RowCell>
                        <Table.RowCell>{session.code}</Table.RowCell>
                        <Table.RowCell>{session.name}</Table.RowCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
