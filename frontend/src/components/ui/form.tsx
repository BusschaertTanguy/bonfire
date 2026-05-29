import { cn } from "@/lib/utils";
import { Form as BaseForm } from "@base-ui/react/form";
import type { ComponentProps } from "react";

type FormProps = ComponentProps<typeof BaseForm>;

const Form = ({ className, ...props }: FormProps) => {
    return (
        <BaseForm {...props} className={cn("flex flex-col gap-2", className)} />
    );
};

export default Form;
