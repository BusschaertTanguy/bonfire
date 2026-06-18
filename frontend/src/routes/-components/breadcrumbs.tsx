import NavLink from "@/components/ui/nav-link";
import { useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

const Breadcrumbs = () => {
    const matches = useRouterState({ select: (s) => s.matches });

    const crumbs = useMemo(
        () =>
            matches
                .filter((match) => match.staticData.breadcrumb)
                .map((match) => {
                    const label =
                        typeof match.staticData.breadcrumb === "function"
                            ? match.staticData.breadcrumb(match.loaderData)
                            : match.staticData.breadcrumb;

                    return { label, path: match.pathname };
                }),
        [matches]
    );

    return (
        <nav className="flex items-center gap-2">
            {crumbs.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-2">
                    <span key={crumb.path}>
                        <NavLink to={crumb.path} size="sm">
                            {crumb.label}
                        </NavLink>
                    </span>
                    {i < crumbs.length - 1 && (
                        <ChevronRight className="size-3.5" />
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
