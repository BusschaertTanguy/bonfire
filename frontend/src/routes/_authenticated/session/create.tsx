import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import type { CreateSessionDto } from "../../../api/sessions/sessions.types";
import { sessionsApi } from "../../../api/sessions/sessions.api";

export const Route = createFileRoute("/_authenticated/session/create")({
    component: RouteComponent,
    staticData: {
        breadcrumb: "Create",
    },
});

const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});

type FormData = z.infer<typeof schema>;

function RouteComponent() {
    const navigate = Route.useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleCreateSession = handleSubmit(async (data: FormData) => {
        const dto: CreateSessionDto = {
            name: data.name,
        };

        const result = await sessionsApi.create(dto);
        await navigate({ to: `/session/${result.data}` });
    });

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1>Create Session</h1>
            <form
                onSubmit={handleCreateSession}
                className="flex flex-col gap-2"
            >
                <div className="flex items-center justify-between gap-2">
                    <label htmlFor="name">Name</label>
                    <input
                        {...register("name")}
                        id="name"
                        type="text"
                        className="rounded border p-1"
                    />
                </div>
                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
                <div className="flex flex-col items-center justify-center gap-2">
                    <button
                        type="submit"
                        className="cursor-pointer rounded border px-4 py-1"
                        disabled={isSubmitting}
                    >
                        Create Session
                    </button>
                    <Link to="/" className="cursor-pointer text-sm">
                        Cancel
                    </Link>
                </div>
            </form>
        </section>
    );
}
