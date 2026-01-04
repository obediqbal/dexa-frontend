export interface User {
    id: string;
    email: string;
    role: 'STAFF' | 'ADMIN';
}

export interface LoginResponse {
    tokenType: string;
    expiresIn: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
