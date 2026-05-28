export interface User {
    readonly id: string;
    readonly name: string;
}

export interface RegisterRequest {
    readonly userName: string;
    readonly email: string;
    readonly password: string;
}

export interface LoginRequest {
    readonly email: string;
    readonly password: string;
}
