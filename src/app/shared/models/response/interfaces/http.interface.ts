import { IDataLoginResponse } from './data-login.interface';
import { IError, IUser } from '@shared/models/common/interfaces';

export interface IHttpResponse {
    status: string;
    data: any;
    message: string;
}
