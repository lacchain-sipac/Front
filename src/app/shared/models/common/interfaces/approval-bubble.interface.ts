export interface IApprovalBubble {
  user: string;
  date: string;
  message: string;
}

export interface IApprovalPayload {
  documentType: string;
  idProject: string;
  idStorage: string;
  nameFile: string;
  role: string;
  observation: string;
  nroApproved: number;
  codeStep: string;
  type: string;
}
