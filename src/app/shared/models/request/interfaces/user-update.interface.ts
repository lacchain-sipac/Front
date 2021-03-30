import { IRole } from '@shared/models/common/interfaces';

export interface IUserUpdateRequest {
    id: string;
    email: string;
    fullname: string;
    surnames: string;
    status: string;
    company: string;
    roles: IRole[];
}
