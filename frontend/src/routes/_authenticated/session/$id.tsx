import {
    getJoinRequestsOptions,
    getSessionOptions,
} from "@/api/sessions/sessions.queries";
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
import { useAuth } from "@/hooks/use-auth";
import useJoinHub from "@/hooks/use-join-hub";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/session/$id")({
    component: RouteComponent,
    beforeLoad: async ({ params, context }) => {
        const sessionData = await context.queryClient.ensureQueryData(
            getSessionOptions(params.id)
        );

        const joinRequestsData = await context.queryClient.ensureQueryData(
            getJoinRequestsOptions(params.id)
        );

        if (
            sessionData.ownerId !== context.userId &&
            !joinRequestsData.some((jr) => jr.userId === context.userId)
        ) {
            throw redirect({
                to: "/session",
            });
        }
    },
    loader: async ({ params, context }) => {
        const data = await context.queryClient.ensureQueryData(
            getSessionOptions(params.id)
        );

        return data;
    },
    staticData: {
        breadcrumb: (data) => {
            const session = data as SessionDto | undefined;
            return session?.name ?? "";
        },
    },
});

function RouteComponent() {
    const { user } = useAuth();
    const session = Route.useLoaderData();

    const joinRequestsQuery = useSuspenseQuery(
        getJoinRequestsOptions(session.id)
    );

    const isOwner = user?.id === session.ownerId;

    const joinHub = useJoinHub({
        enabled: true,
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
        joinHub.joinSession(session.id).then().catch(console.error);
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
                    {joinRequestsQuery.data.map((joinRequest) => (
                        <TableRow key={joinRequest.userId}>
                            <TableRowCell>{joinRequest.name}</TableRowCell>
                            <TableRowCell>{joinRequest.status}</TableRowCell>
                            <TableRowCell className="text-center">
                                <Button
                                    disabled={
                                        !isOwner ||
                                        joinRequest.status !==
                                            JoinRequestStatus.Pending
                                    }
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
