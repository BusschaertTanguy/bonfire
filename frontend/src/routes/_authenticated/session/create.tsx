import { sessionsApi } from "@/api/sessions/sessions.api";
import type { CreateSessionDto } from "@/api/sessions/sessions.types";
import Button from "@/components/ui/button";
import {
    Field,
    FieldControl,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import Form from "@/components/ui/form";
import NavLink from "@/components/ui/nav-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

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
        control,
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        },
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
            <Form onSubmit={handleCreateSession}>
                <Controller
                    control={control}
                    name="name"
                    render={({
                        field: { ref, name, value, onBlur, onChange },
                        fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                        <Field
                            name={name}
                            invalid={invalid}
                            touched={isTouched}
                            dirty={isDirty}
                        >
                            <FieldLabel>Name</FieldLabel>
                            <FieldControl
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                onValueChange={onChange}
                                type="text"
                                placeholder="Name"
                            />
                            <FieldError match={!!error}>
                                {error?.message}
                            </FieldError>
                        </Field>
                    )}
                />
                <div className="mt-4 flex flex-col justify-center gap-2">
                    <Button type="submit" loading={isSubmitting}>
                        Create Session
                    </Button>
                    <NavLink to="/session" size="sm">
                        Cancel
                    </NavLink>
                </div>
            </Form>
        </section>
    );
}
