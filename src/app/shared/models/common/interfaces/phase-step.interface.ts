import { IDocumentType } from './document-type.interface';
import { IActionType } from './action-type.interface';

export interface IPhaseStep {
  name: string;
  code: string;
  description: string;
  documentType: IDocumentType[];
  accessType: IActionType[];
}
