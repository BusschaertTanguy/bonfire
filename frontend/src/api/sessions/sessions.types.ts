export interface CreateSessionDto {
    readonly name: string;
}

export interface SessionDto {
    readonly id: string;
    readonly ownerId: string;
    readonly code: string;
    readonly name: string;
}

export const JoinRequestStatus = {
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
} as const;

export type JoinRequestStatus =
    (typeof JoinRequestStatus)[keyof typeof JoinRequestStatus];

export interface JoinRequestDto {
    readonly userId: string;
    readonly name: string | null;
    readonly status: JoinRequestStatus;
}
