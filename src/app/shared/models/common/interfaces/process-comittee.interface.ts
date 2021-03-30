import { IComiteeMembers } from '@shared/models/common/interfaces';

export interface IComitteeRole {
  id: string;
  name: string;
}

export interface IItemComittee {
  detailRole?: string;
  id?: string;
  role: IComitteeRole;
  user: string;
}

export interface IComittee {
  accredited: boolean;
  committee: IComiteeMembers[];
  hash: string;
}
