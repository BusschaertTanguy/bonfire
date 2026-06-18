import NavLink from "@/components/ui/nav-link";
import { useAuth } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";
import JoinSessionDialog from "./_authenticated/-components/join-session";
import { LoaderCircle } from "lucide-react";

export const Route = createFileRoute("/")({
    component: IndexComponent,
});

function IndexComponent() {
    const { user, isLoading } = useAuth();

    return (
        <section className="flex h-full w-full flex-col items-center justify-center gap-4">
            {isLoading && (
                <p className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    <span>Authenticating...</span>
                </p>
            )}
            {!user && !isLoading && (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </>
            )}
            {!!user && !isLoading && (
                <>
                    <JoinSessionDialog />
                    <NavLink to="/session">My sessions</NavLink>{" "}
                </>
            )}
        </section>
    );
}
