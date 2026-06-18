import Button from "@/components/ui/button";
import {
    Dialog,
    DialogBackdrop,
    DialogPopup,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldControl,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import Form from "@/components/ui/form";
import useJoinHub from "@/hooks/use-join-hub";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
    code: z
        .string()
        .length(7, { message: "Session code must be 7 characters long" }),
});

type FormData = z.infer<typeof schema>;

interface JoinSessionProps {
    onClose: () => void | Promise<void>;
}

const JoinSession = ({ onClose }: JoinSessionProps) => {
    const [joinPending, setJoinPending] = useState(false);

    const { handleSubmit, control } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            code: "",
        },
    });

    const joinHub = useJoinHub({
        onJoinRequestStatusChanged: async () => {
            // TODO: Join requested session

            await onClose();
        },
    });

    const handleJoin = handleSubmit(async (data: FormData) => {
        setJoinPending(true);
        await joinHub.addJoinRequest(data.code);
    });

    return (
        <Form onSubmit={handleJoin}>
            <Controller
                control={control}
                name="code"
                render={({
                    field: { ref, name, value, onBlur, onChange },
                    fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                    <Field
                        name={name}
                        invalid={invalid}
                        touched={isTouched}
                        dirty={isDirty}
                    >
                        <FieldLabel>Session Code</FieldLabel>
                        <FieldControl
                            ref={ref}
                            value={value}
                            onBlur={onBlur}
                            onValueChange={onChange}
                            type="text"
                            placeholder="Session Code"
                            className="w-full"
                            readOnly={joinPending}
                        />
                        <FieldError match={!!error}>
                            {error?.message}
                        </FieldError>
                    </Field>
                )}
            />
            {joinPending && <p>Wait for the host to approve your request...</p>}
            <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                <Button type="submit" loading={joinPending}>
                    Join
                </Button>
            </div>
        </Form>
    );
};

const JoinSessionDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={<Button variant="nav">Join session</Button>}
            />
            <DialogPortal keepMounted={false}>
                <DialogBackdrop />
                <DialogPopup>
                    <DialogTitle>Join session</DialogTitle>
                    <JoinSession
                        onClose={() => {
                            setOpen(false);
                        }}
                    />
                </DialogPopup>
            </DialogPortal>
        </Dialog>
    );
};

export default JoinSessionDialog;
