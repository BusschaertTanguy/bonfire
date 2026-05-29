import { cn } from "@/lib/utils";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";

const buttonVariants = cva(
    "inline-flex cursor-pointer items-center justify-center rounded transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "border-primary bg-primary text-primary-foreground hover:bg-primary/80 border",
                outline:
                    "border-primary bg-background text-primary hover:bg-primary/5 border",
                nav: "text-primary underline-offset-4 hover:underline",
                icon: "text-primary hover:bg-primary/5 aspect-square rounded-full p-1",
            },
            size: {
                default: "h-8 gap-2 px-2 [&_svg]:size-4",
                sm: "h-6 gap-1 px-1 [&_svg]:size-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type ButtonProps = ComponentProps<typeof BaseButton> &
    VariantProps<typeof buttonVariants> & {
        loading?: boolean;
    };

const Button = ({
    className,
    variant = "default",
    size = "default",
    loading,
    disabled,
    children,
    ...props
}: ButtonProps) => {
    return (
        <BaseButton
            {...props}
            disabled={loading ?? disabled}
            focusableWhenDisabled={!!loading}
            className={cn(buttonVariants({ variant, size, className }))}
        >
            {loading && <LoaderCircle className="animate-spin" />}
            {children}
        </BaseButton>
    );
};

export default Button;
