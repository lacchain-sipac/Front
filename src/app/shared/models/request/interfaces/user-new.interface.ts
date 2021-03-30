import { IRole } from '@shared/models/common/interfaces';

export interface IUserNewRequest {
    email: string;
    fullname: string;
    surnames: string;
    status: string;
    company: string;
    roles: IRole[];
}
