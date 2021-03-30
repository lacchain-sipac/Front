import { IRole } from '../interfaces';

export class RoleSelect {
  id: string;
  name: string;

  constructor(role: IRole) {
    this.id = role.code;
    this.name = role.name;
  }
}
