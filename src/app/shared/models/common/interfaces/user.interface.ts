import { IRole } from './role.interface';

export interface IUser {
    id?: string;
    email: string;
    company: string;
    fullname: string;
    surnames: string;
    status: IStatus;
    roles: IRole[];
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
    completed?: boolean;
}

interface IStatus {
    code: string;
    name?: string;
}
