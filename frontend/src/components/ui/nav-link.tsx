import { cn } from "@/lib/utils";
import { createLink } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const navLinkVariants = cva(
    "inline-flex items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "text-primary underline-offset-4 hover:underline",
                ghost: "text-primary",
                icon: "text-primary hover:bg-primary/5 aspect-square rounded-full p-1",
            },
            size: {
                default: "h-8 [&_svg]:size-4",
                sm: "h-6 text-sm [&_svg]:size-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type NavLinkProps = ComponentProps<"a"> & VariantProps<typeof navLinkVariants>;

const BaseNavLink = ({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
}: NavLinkProps) => {
    return (
        <a
            {...props}
            className={cn(navLinkVariants({ variant, size, className }))}
        >
            {children}
        </a>
    );
};

const NavLink = createLink(BaseNavLink);

export default NavLink;
