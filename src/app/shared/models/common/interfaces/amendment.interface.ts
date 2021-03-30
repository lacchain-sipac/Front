export interface IAmendmentNoObjection {
  dateCreation: string;
  fileName: string;
  hash: string;
  idStorage: string;
  observation: string;
  user: string;
}

export interface IAmendmentRequest {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash: string;
}

export interface IAcredited {
  date: string;
  hash: string;
  observation: string;
  role: string;
  user: string;
}

export interface IAmendmentApprove {
  date: string;
  hash: string;
  observation: string;
  user: string;
  type: string;
}

export interface IAmendmentDocument {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
}

export interface IAmendmentDocuments {
  document: IAmendmentDocument;
  review: IAmendmentApprove[];
  approved: IAmendmentApprove;
}

export interface IAmendmentResponse {
  accredited: boolean;
  document: IAmendmentDocuments[];
}

export interface IAmendment {
  id: string;
  noObjection: IAmendmentNoObjection[];
  request: IAmendmentRequest[];
  response: IAmendmentResponse;
  responseNoObjection: IAmendmentNoObjection[];
}
