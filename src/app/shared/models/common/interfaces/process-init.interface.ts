import { IAmendment } from './amendment.interface';
import { IInitClarify } from './init-clarify.interface';

export interface IAccreditedDocument {
  date: string;
  hash: string;
  observation: string;
  role: string;
  user: string;
}

export interface IDocumentReview {
  date: string;
  observation: string;
  user: string;
  type?: string;
  hash?: string;
}

export interface IBiddingDocDetails {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash: string;
}

export interface IDocumentDetails {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash: string;
}

export interface IReviewAndDocument {
  document: IBiddingDocDetails;
  review?: IDocumentReview[];
  approved?: IDocumentReview;
}

export interface IBiddingDocument {
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

export interface IPreparationDocument {
  bidding: IBiddingDocument[];
  noObjection: INoObjection[];
}

export interface IInitPreparation {
  bidding: IBiddingDocument;
  noObjection: INoObjection[];
  responseNoObjection: INoObjection[];
  linkRepository: string;
}

export interface IInit {
  accredited: boolean;
  amendment: IAmendment[];
  clarify: IInitClarify[];
  preparation: IInitPreparation;
}
