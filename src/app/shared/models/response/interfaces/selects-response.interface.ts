import { IHttpResponse } from '@shared/models/response/interfaces';


export interface ISelectsResponse {
  transactionTypeData: IHttpResponse;
  contributionData: IHttpResponse;
  operationNumberData: IHttpResponse;
  fundingSourceData: IHttpResponse;
}

export interface ISelectsAcquisitionMethodForm {
  acquisitionMethod: IHttpResponse;
  contractType: IHttpResponse;
}

export interface ISelectsContractorAndSupervisor {
  idContractor: IHttpResponse;
  idSupervising: IHttpResponse;
}
