export interface AuthenticateResponse {
    id: string;
    username: string;
    token: string;
}

export interface AuthenticateRequest {
    username: string;
    password: string;
}