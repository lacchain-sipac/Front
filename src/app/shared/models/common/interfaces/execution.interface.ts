export interface IExecution {
  assignContractor: AssignContractor;
  finishExecute: boolean;
  codeStep: string;
  currentStep: number;
  id: string;
  idProject: string;
  modifiedContract: ModifiedContract;
  payment: Payment;
  qualityGuarantee: QualityGuarantee;
}

export interface QualityGuarantee {
  accredited: boolean;
  hasQualityGuarantee: boolean;
  observation: string;
}

export interface Payment {
  modifiedContract: ModifiedContract;
  estimate: Estimate[];
  advance: Advance[];
  finalPayment: Advance[];
  accredited: boolean;
}

export interface Estimate {
  data: string;
  id: string;
  f01: Document[];
  proffPayment: Document[];
  request: ModifiedContract;
}

export interface Advance {
  id: string;
  f01: Document[];
  proffPayment: Document[];
  request: ModifiedContract;
}

export interface ModifiedContract {
  accredited: boolean;
  document: DocumentData[];
}

export interface DocumentData {
  approved?: Review;
  document: Document;
  review: Review[];
}

export interface Review {
  date: string;
  hash: string;
  observation: string;
  type: string;
  user: string;
}

export interface Document {
  dateCreation: string;
  fileName: string;
  hash: string;
  idStorage: string;
  company?: string;
  observation: string;
  user: string;
}

export interface AssignContractor {
  accredited: boolean;
  contractor: string[];
  supervising: string[];
}
