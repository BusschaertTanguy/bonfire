import { sessionsApi } from "@/api/sessions/sessions.api";
import NavLink from "@/components/ui/nav-link";
import {
    TableBody,
    TableHead,
    TableHeadCell,
    Table,
    TableRow,
    TableRowCell,
} from "@/components/ui/table";
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
        <Table>
            <TableHead>
                <TableHeadCell className="w-12 text-center">
                    <NavLink to="/session/create" variant="icon">
                        <CirclePlus />
                    </NavLink>
                </TableHeadCell>
                <TableHeadCell>Code</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
            </TableHead>
            <TableBody>
                {sessions.map((session) => (
                    <TableRow key={session.id}>
                        <TableRowCell className="text-center">
                            <NavLink
                                to={"/session/$id"}
                                params={{ id: session.id }}
                                variant="icon"
                            >
                                <Eye />
                            </NavLink>
                        </TableRowCell>
                        <TableRowCell>{session.code}</TableRowCell>
                        <TableRowCell>{session.name}</TableRowCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
