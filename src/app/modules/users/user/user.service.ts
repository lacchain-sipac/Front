import { Injectable } from '@angular/core';
import { IUserUpdateRequest, IUserNewRequest } from '@shared/models/request/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { environment } from '@environments/environment';
import { PATH_ENDPOINTS_USERS, PATH_ENDPOINTS_NOTIFY } from '@shared/helpers';
import { DataService } from '@core/services';
import { Observable } from 'rxjs';
import { String } from 'typescript-string-operations';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private dataService: DataService) {
  }

  listUsers(): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${PATH_ENDPOINTS_USERS.all}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }

  sendInvitation(request: any) {
    const api = `${environment.pathApis.notifiy}${PATH_ENDPOINTS_NOTIFY.sendEmail}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(api);

    return this.dataService.execPostJson(parameters).pipe();
  }

  listCompanies(): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${PATH_ENDPOINTS_USERS.getCompanies}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }

  getUser(id: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${String.Format(PATH_ENDPOINTS_USERS.get, id)}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }

  addUser(request: IUserNewRequest): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${PATH_ENDPOINTS_USERS.add}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPostJson(parameters).pipe();
  }

  updateUser(request: IUserUpdateRequest): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${String.Format(PATH_ENDPOINTS_USERS.update, request.id)}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);
    return this.dataService.execPutJson(parameters).pipe();
  }

  updateUserStatus(id: string, status: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${String.Format(PATH_ENDPOINTS_USERS.updateStatus, id)}`;
    const parameters: string = JSON.stringify({ codeStatus: status });
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe();
  }

  // KayTrust

  getStateToEnrollKayTrust(): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.users}${PATH_ENDPOINTS_USERS.getState}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }
}
