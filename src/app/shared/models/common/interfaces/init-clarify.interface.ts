export interface IRequestApprove {
  date: string;
  observation: string;
  user: string;
}

export interface IRequestDocument {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash: string;
}

export interface IClarifyRequest {
  approved: IRequestApprove[];
  document: IRequestDocument;
}

export interface IAccreditedResponse {
  date: string;
  hash: string;
  observation: string;
  role: string;
  user: string;
}

export interface IResponseApprove {
  date: string;
  observation: string;
  user: string;
}

export interface IResponseDocument {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
  hash: string;
}

export interface IReviewDocument {
  date: string;
  hash: string;
  observation: string;
  type: string;
  user: string;
}

export interface IClarifyDocument {
  document: IRequestDocument;
  review: IReviewDocument[];
  approved?: IReviewDocument;
}

export interface IClarifyResponse {
  accredited: boolean;
  document: IClarifyDocument[];
}

export interface IInitClarify {
  id: string;
  request: IRequestDocument[];
  response: IClarifyResponse;
}
