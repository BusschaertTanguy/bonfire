import { getJoinRequestsOptions } from "@/api/sessions/sessions.queries";
import { sessionsApi } from "@/api/sessions/sessions.api";
import {
    JoinRequestStatus,
    type SessionDto,
} from "@/api/sessions/sessions.types";
import Button from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeadCell,
    TableRow,
    TableRowCell,
} from "@/components/ui/table";
import useJoinHub from "@/hooks/use-join-hub";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/session/$id")({
    component: RouteComponent,
    loader: async ({ params }) => {
        const response = await sessionsApi.get(params.id);
        return response.data;
    },
    staticData: {
        breadcrumb: (data) => {
            const session = data as SessionDto | undefined;
            return session?.name ?? "";
        },
    },
});

function RouteComponent() {
    const session = Route.useLoaderData();
    const joinRequestsQuery = useQuery(getJoinRequestsOptions(session.id));

    const joinHub = useJoinHub({
        onJoinRequestAdded: async () => {
            await joinRequestsQuery.refetch();
        },
        onJoinRequestStatusChanged: async () => {
            await joinRequestsQuery.refetch();
        },
    });

    const changeStatus = async (userId: string, status: JoinRequestStatus) => {
        await joinHub.changeJoinRequestStatus(session.id, userId, status);
    };

    useEffect(() => {
        joinHub.joinSessionOwnerGroup(session.id).then().catch(console.error);
    }, [joinHub, session.id]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Session: {session.code}</h1>
            <h2 className="text-xl font-semibold">Join Requests</h2>
            <Table>
                <TableHead>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="w-12"></TableHeadCell>
                </TableHead>
                <TableBody>
                    {joinRequestsQuery.data?.map((joinRequest) => (
                        <TableRow key={joinRequest.userId}>
                            <TableRowCell>{joinRequest.name}</TableRowCell>
                            <TableRowCell>{joinRequest.status}</TableRowCell>
                            <TableRowCell className="text-center">
                                <Button
                                    variant="icon"
                                    size="sm"
                                    onClick={() =>
                                        changeStatus(
                                            joinRequest.userId,
                                            JoinRequestStatus.Approved
                                        )
                                    }
                                >
                                    <Check />
                                </Button>
                            </TableRowCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
