import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import type { LoginRequest } from "../api/auth/auth.types";
import { useAuth } from "../hooks/use-auth";
import { authApi } from "../api/auth/auth.api";

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
    const router = useRouter();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleLogin = handleSubmit(async (data: FormData) => {
        const dto: LoginRequest = {
            email: data.email,
            password: data.password,
        };

        await authApi.postLogin(dto);
        await loadUser();

        await router.invalidate();
        await navigate({ to: "/" });
    });

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        className="rounded border p-1"
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
                <div className="flex items-center justify-between gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                        {...register("password")}
                        id="password"
                        type="password"
                        className="rounded border p-1"
                    />
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
                <div className="flex flex-col items-center justify-center gap-2">
                    <button
                        type="submit"
                        className="cursor-pointer rounded border px-4 py-1"
                        disabled={isSubmitting}
                    >
                        Login
                    </button>
                    <Link to="/" className="cursor-pointer text-sm">
                        Cancel
                    </Link>
                </div>
            </form>
        </section>
    );
}
