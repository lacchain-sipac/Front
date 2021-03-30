export interface IPasswordRequest {
    password: string;
    confirmPassword: string;
    es2FA?: boolean;
    type?: string;
    verifiedCode?: string;
    secretKey?: string;
}
