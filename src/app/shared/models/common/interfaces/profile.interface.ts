import { IRole } from './role.interface';

export interface IProfile {
    id: string;
    fullname: string;
    surnames: string;
    email: string;
    roles: IRole[];
}
