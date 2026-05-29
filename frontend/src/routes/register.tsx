import { authApi } from "@/api/auth/auth.api";
import type { RegisterRequest } from "@/api/auth/auth.types";
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

export const Route = createFileRoute("/register")({
    component: RegisterComponent,
});

const schema = z.object({
    userName: z.string().min(1, { message: "User name is required" }),
    email: z.email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

type FormData = z.infer<typeof schema>;

function RegisterComponent() {
    const navigate = Route.useNavigate();

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
        },
    });

    const handleRegister = handleSubmit(async (data: FormData) => {
        const dto: RegisterRequest = {
            email: data.email,
            password: data.password,
            userName: data.userName,
        };

        await authApi.register(dto);
        await navigate({ to: "/login" });
    });

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1>Register</h1>
            <Form onSubmit={handleRegister}>
                <Controller
                    control={control}
                    name="userName"
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
                            <FieldLabel>User name</FieldLabel>
                            <FieldControl
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                onValueChange={onChange}
                                type="text"
                                placeholder="User name"
                            />
                            <FieldError match={!!error}>
                                {error?.message}
                            </FieldError>
                        </Field>
                    )}
                />
                <Controller
                    control={control}
                    name="email"
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
                            <FieldLabel>Email</FieldLabel>
                            <FieldControl
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                onValueChange={onChange}
                                type="email"
                                placeholder="Email"
                            />
                            <FieldError match={!!error}>
                                {error?.message}
                            </FieldError>
                        </Field>
                    )}
                />
                <Controller
                    control={control}
                    name="password"
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
                            <FieldLabel>Password</FieldLabel>
                            <FieldControl
                                ref={ref}
                                value={value}
                                onBlur={onBlur}
                                onValueChange={onChange}
                                type="password"
                                placeholder="Password"
                            />
                            <FieldError match={!!error}>
                                {error?.message}
                            </FieldError>
                        </Field>
                    )}
                />
                <div className="mt-4 flex flex-col justify-center gap-2">
                    <Button type="submit" loading={isSubmitting}>
                        Register
                    </Button>
                    <NavLink to="/" size="sm">
                        Cancel
                    </NavLink>
                </div>
            </Form>
        </section>
    );
}
