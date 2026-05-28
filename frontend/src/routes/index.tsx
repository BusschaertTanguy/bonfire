import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../hooks/use-auth";

export const Route = createFileRoute("/")({
    component: IndexComponent,
});

function IndexComponent() {
    const { user } = useAuth();

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <button className="cursor-pointer">Join session</button>
            {!user && (
                <>
                    <Link to="/login" className="cursor-pointer">
                        Login
                    </Link>
                    <Link to="/register" className="cursor-pointer">
                        Register
                    </Link>
                </>
            )}
            {!!user && (
                <>
                    <button className="cursor-pointer">Create session</button>
                    <Link to="/session">My sessions</Link>
                </>
            )}
        </section>
    );
}
