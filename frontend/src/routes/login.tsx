import { authApi } from "@/api/auth/auth.api";
import type { LoginRequest } from "@/api/auth/auth.types";
import Button from "@/components/ui/button";
import {
    Field,
    FieldControl,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import Form from "@/components/ui/form";
import NavLink from "@/components/ui/nav-link";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/login")({
    component: LoginComponent,
});

const schema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

type FormData = z.infer<typeof schema>;

function LoginComponent() {
    const { loadUser } = useAuth();
    const navigate = Route.useNavigate();

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = handleSubmit(async (data: FormData) => {
        const dto: LoginRequest = {
            email: data.email,
            password: data.password,
        };

        await authApi.login(dto);
        await loadUser();
        await navigate({ to: "/" });
    });

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1>Login</h1>
            <Form onSubmit={handleLogin}>
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
                        Login
                    </Button>
                    <NavLink to="/" size="sm">
                        Cancel
                    </NavLink>
                </div>
            </Form>
        </section>
    );
}
