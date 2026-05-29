import { cn } from "@/lib/utils";
import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";

type FieldProps = ComponentProps<typeof BaseField.Root>;

const Field = ({ className, ...props }: FieldProps) => {
    return (
        <BaseField.Root
            {...props}
            className={cn("flex flex-col items-start gap-1", className)}
        />
    );
};

type FieldLabelProps = ComponentProps<typeof BaseField.Label>;

const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
    return <BaseField.Label {...props} className={cn("w-64", className)} />;
};

type FieldControlProps = ComponentProps<typeof BaseField.Control>;

const FieldControl = ({ className, ...props }: FieldControlProps) => {
    return (
        <BaseField.Control
            {...props}
            className={cn(
                "focus:ring-primary/50 w-64 rounded border px-2 py-1 outline-none focus:ring-1 aria-invalid:border-red-500 aria-invalid:ring-1 aria-invalid:ring-red-500",
                className
            )}
        />
    );
};

type FieldErrorProps = ComponentProps<typeof BaseField.Error>;

const FieldError = ({ className, ...props }: FieldErrorProps) => {
    return (
        <BaseField.Error
            {...props}
            className={cn("w-64 text-sm text-red-500", className)}
        />
    );
};

export { Field, FieldLabel, FieldControl, FieldError };
