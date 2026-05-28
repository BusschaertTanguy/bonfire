import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { authApi } from "../api/auth/auth.api";
import type { RegisterRequest } from "../api/auth/auth.types";
import { createFileRoute, Link } from "@tanstack/react-router";

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
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleRegister = handleSubmit(async (data: FormData) => {
        const dto: RegisterRequest = {
            email: data.email,
            password: data.password,
            userName: data.userName,
        };

        await authApi.postRegister(dto);
        await navigate({ to: "/login" });
    });

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1>Register</h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <label htmlFor="userName">User name</label>
                    <input
                        {...register("userName")}
                        id="userName"
                        type="text"
                        className="rounded border p-1"
                    />
                </div>
                {errors.userName && (
                    <p className="text-sm text-red-500">
                        {errors.userName.message}
                    </p>
                )}
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
                        Register
                    </button>
                    <Link to="/" className="cursor-pointer text-sm">
                        Cancel
                    </Link>
                </div>
            </form>
        </section>
    );
}
