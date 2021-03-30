import { Injectable } from '@angular/core';
import { DataService } from '@core/services';
import { environment } from '@environments/environment';
import { PATH_ENDPOINTS_USERS } from '@shared/helpers';
import { IForgotPasswordRequest } from '@shared/models/request/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private dataService: DataService) { }

  forgotPassword(request: IForgotPasswordRequest): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${PATH_ENDPOINTS_USERS.forgotPassword}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);
    return this.dataService.execPostJson(parameters);
  }
}
