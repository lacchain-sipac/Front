import { IActionType } from './action-type.interface';
import { IDocumentType } from './document-type.interface';
import { IPhaseStep } from './phase-step.interface';
import { IPhase } from './phase.interface';

export interface IValidationJson {
  name: string;
  code: string;
  description: string;
  fases: IPhase[];
}

export enum AccessType {
  read = 'read',
  write = 'write',
  upload = 'upload',
  approved = 'approved',
  acreditted = 'acreditted'
}

export class Rules {
  private fases: IPhase[];
  private steps: IPhaseStep[];
  private actionType: IActionType[];
  private roles: string[];
  private documentType: IDocumentType[];

  constructor(
    data: IValidationJson,
  ) {
    this.fases = data.fases;
  }

  getStepsFromPhase(phase: string) {
    this.steps = this.fases.find((item) => item.code === phase).step;
    return this;
  }

  getAccessTypeFromStep(step: string) {
    this.actionType = this.steps.find(item => item.code === step).accessType;
    return this;
  }

  getDocumentTypeFromStep(step: string) {
    const documentType: IDocumentType[] = this.steps.find(item => item.code === step).documentType;
    let documentsType: IDocumentType[] = documentType;

    documentType.forEach(item => {
      documentsType = documentsType.concat(item.documentTypeAssociated);
    });

    this.documentType = documentsType;
    return this;
  }

  getActionsFromDocument(documentType: string) {
    this.actionType = this.documentType.find(item => item.code === documentType).actionType;
    return this;
  }

  rolesWithAccessTo(access: AccessType) {
    this.roles = this.actionType.find(item => item.code === access).rolesAuth;
    return this;
  }

  roleHasAccesToApproveDocuments(nroApproved, role) {
    const roles = [...this.roles];
    return roles[nroApproved] === role;
  }

  roleHasAccess(role: string) {
    return this.roles.includes(role);
  }
}
