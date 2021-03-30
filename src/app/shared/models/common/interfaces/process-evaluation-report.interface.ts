import { IDocumentReview } from '.';

export interface IEvaluationAccredited {
  date: string;
  hash: string;
  observation: string;
  role: string;
  user: string;
}

export interface EvaluationApprove {
  date: string;
  observation: string;
  user: string;
}

export interface EvaluationDocument {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash: string;
}

export interface IReviewAndDocument {
  document: EvaluationDocument;
  review?: IDocumentReview[];
  approved?: IDocumentReview;
}

export interface IEvaluation {
  accredited: boolean;
  document: IReviewAndDocument[];
}

export interface INoObjection {
  dateCreation: string;
  fileName: string;
  hash: string;
  idGroup: string;
  idStorage: string;
  observation: string;
  user: string;
}

export interface IEvaluationReport {
  evaluation: IEvaluation;
  noObjection: INoObjection[];
  responseNoObjection: INoObjection[];
  accredited: boolean;
}
