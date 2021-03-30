import { Injectable } from '@angular/core';
import { DataService } from '@core/services';
import { environment } from '@environments/environment';
import { PATH_ENDPOINTS_PARAMETERS, PATH_ENDPOINTS_RULES } from '@shared/helpers';
import { Rules } from '@shared/models/common/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { String } from 'typescript-string-operations';

@Injectable({ providedIn: 'root' })
export class ParametersService {
  rules: Rules;

  constructor(private dataService: DataService) { }

  getStatusUser(): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.parameters}${PATH_ENDPOINTS_PARAMETERS.statusUser}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }

  getRoles(): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.parameters}${PATH_ENDPOINTS_PARAMETERS.roles}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }

  getParameterByType(type: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.parameters}${PATH_ENDPOINTS_PARAMETERS.byType}${type}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson();
  }

  getRules(idProject: string) {
    const pathService = `${environment.pathApis.parameters}${String.Format(PATH_ENDPOINTS_RULES.getRules, idProject)}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe(
      tap((rulesResponse) => {
        this.rules = new Rules(rulesResponse.data);
      })
    );

  }
}
