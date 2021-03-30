import { IComiteeMembers, IRole } from '../interfaces';
import { RoleSelect } from './role-select.class';

export class CommitteeViewer {
  id: string;
  detailRole: string;
  role: RoleSelect;
  user: string;

  constructor(committeeMember: IComiteeMembers) {
    this.id = committeeMember.id;
    this.detailRole = committeeMember.detailRole;
    this.user = committeeMember.user;
    this.role = this.createRoleSelect(committeeMember.role);
  }

  createRoleSelect(role): RoleSelect {
    const rol: IRole = {
      code: role.id,
      name: role.name
    };
    return new RoleSelect(rol);
  }
}
