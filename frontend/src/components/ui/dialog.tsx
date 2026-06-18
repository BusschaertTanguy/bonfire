import { cn } from "@/lib/utils";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { type ComponentProps } from "react";

type DialogProps = ComponentProps<typeof BaseDialog.Root>;

const Dialog = (props: DialogProps) => {
    return <BaseDialog.Root {...props} />;
};

type DialogTriggerProps = ComponentProps<typeof BaseDialog.Trigger>;

const DialogTrigger = ({ className, ...props }: DialogTriggerProps) => {
    return <BaseDialog.Trigger {...props} className={cn("", className)} />;
};

type DialogTitleProps = ComponentProps<typeof BaseDialog.Title>;

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
    return (
        <BaseDialog.Title
            {...props}
            className={cn("text-base font-bold", className)}
        />
    );
};

type DialogDescriptionProps = ComponentProps<typeof BaseDialog.Description>;

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
    return (
        <BaseDialog.Description
            {...props}
            className={cn("text-sm", className)}
        />
    );
};

type DialogCloseProps = ComponentProps<typeof BaseDialog.Close>;

const DialogClose = ({ className, ...props }: DialogCloseProps) => {
    return <BaseDialog.Close {...props} className={cn("", className)} />;
};

type DialogPortalProps = ComponentProps<typeof BaseDialog.Portal>;

const DialogPortal = ({ className, ...props }: DialogPortalProps) => {
    return <BaseDialog.Portal {...props} className={cn("", className)} />;
};

type DialogBackdropProps = ComponentProps<typeof BaseDialog.Backdrop>;

const DialogBackdrop = ({ className, ...props }: DialogBackdropProps) => {
    return (
        <BaseDialog.Backdrop
            {...props}
            className={cn(
                "fixed inset-0 min-h-dvh bg-black opacity-20",
                className
            )}
        />
    );
};

type DialogPopupProps = ComponentProps<typeof BaseDialog.Popup>;

const DialogPopup = ({ className, ...props }: DialogPopupProps) => {
    return (
        <BaseDialog.Popup
            {...props}
            className={cn(
                "bg-primary-foreground fixed top-1/2 left-1/2 flex w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded p-4",
                className
            )}
        />
    );
};

export {
    Dialog,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogPortal,
    DialogBackdrop,
    DialogPopup,
};
