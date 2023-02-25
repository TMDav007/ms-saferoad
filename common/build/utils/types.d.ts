export interface UserPayload {
    id: string;
    email: string;
    verified: boolean;
}
export interface JwtPayload {
    [key: string]: any;
    id?: string;
    currentUser: string;
    email: string;
    verified: boolean;
    sub?: string | undefined;
    exp?: number | undefined;
    nbf?: number | undefined;
    iat?: number | undefined;
}
