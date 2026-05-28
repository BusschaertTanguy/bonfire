export interface CreateSessionDto {
    readonly name: string;
}

export interface SessionDto {
    readonly id: string;
    readonly code: string;
    readonly name: string;
}
