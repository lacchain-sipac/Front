import { IHttpResponse } from '@shared/models/response/interfaces';

export interface IAccessType {
  name: string;
  code: string;
  rolesAuth: string[];
}

export interface IHasAccesToExecuteActions {
  hasAccessToCreateSolicitude: IHttpResponse;
  hasAccessToAcreditSolicitude: IHttpResponse;
}
