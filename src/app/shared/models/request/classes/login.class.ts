import { ILoginRequest } from '@shared/models/request/interfaces';

export class Login implements ILoginRequest {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
