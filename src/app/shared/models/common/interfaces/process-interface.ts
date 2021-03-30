import { IComittee } from './process-comittee.interface';
import { IEvaluationReport } from './process-evaluation-report.interface';
import { IInit } from './process-init.interface';
import { Review } from '.';

export interface ILoadStructure {
  accredited: boolean;
  budgetStructure: string;
  availabilityStructure: boolean;
  hash: string;
  additionalComment: string;
}

export interface IOpeningActAccreditation {
  date: string;
  hash: string;
  observation: string;
  role: string;
  user: string;
}

export interface IOpeningApprove {
  date: string;
  observation: string;
  user: string;
}

export interface IOpeningActDocument {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash?: string;
  idGroup?: string;
}

export interface IOpeningAct {
  accredited: boolean;
  document: IOpeningActDocument[];
}

export interface ISignedContractCollection {
  accredited: boolean;
  document: ISignedContractContact[];
  id: string;
}

export interface ISignedContractContact {
  approved?: Review;
  review?: Review[];
  aid?: string;
  document: IOpeningActDocument;
}

export interface ISignedContract {
  accredited: boolean;
  contract: ISignedContractCollection[];
  numberPrism: string;
}

export interface IAwardResolution {
  accredited: boolean;
  document: IOpeningActDocument[];
}

export interface IProcess {
  awardResolution: IAwardResolution;
  committee: IComittee;
  currentStep: number;
  codeStep: string;
  evaluationReport: IEvaluationReport;
  id: string;
  idProject: string;
  idSolicitude: string;
  init: IInit;
  initialized: boolean;
  loadStructure: ILoadStructure;
  openingAct: IOpeningAct;
  signedContract: ISignedContract;
  finishProcess: boolean;
}
