import { IClassificationType } from './classification-type.interface';
import { IActionType } from './action-type.interface';

export interface IDocumentType {
  name: string;
  code: string;
  description: string;
  clasificationType: IClassificationType[];
  actionType: IActionType[];
  documentTypeAssociated: IDocumentType[];
}

export interface IdocumentInformation {
  phaseCode: string;
  codeStep: string;
  documentType: string;
}

