import Button from "@/components/ui/button";
import NavLink from "@/components/ui/nav-link";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: IndexComponent,
});

function IndexComponent() {
    const { user } = useAuth();

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            <Button variant="nav">Join session</Button>
            {!user && (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </>
            )}
            {!!user && <NavLink to="/session">My sessions</NavLink>}
        </section>
    );
}
