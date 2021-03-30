import { IPrivilegeRole } from './privilege-role.interface';

export interface IRole {
    code: string;
    name?: string;
    description?: string;
    privileges?: IPrivilegeRole[];
}
