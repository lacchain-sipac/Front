import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { PATH_ENDPOINTS_USERS, Keys } from '@shared/helpers';
import { String } from 'typescript-string-operations';
import { JwtHelperService } from '@auth0/angular-jwt';


import * as dataGetProfile from '../../../assets/jsons/responses/res-get-profile.json';
import { IProfile } from '@shared/models/common/interfaces/index.js';
import { IHttpResponse } from '@shared/models/response/interfaces/index.js';

@Injectable({ providedIn: 'root' })
export class ProfileResolverService implements Resolve<any> {

  private helper = new JwtHelperService();

  constructor(private http: HttpClient) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProfile> {
    const token: string = localStorage.getItem(Keys.accessToken);
    if (token) {
      const id: string = this.helper.decodeToken(token).uuid;
      const path: string = PATH_ENDPOINTS_USERS.getProfile;
      const endpoint: string = String.Format(path, id);
      const pathService = `${environment.pathApis.users}${endpoint}`;

      return this.http.get<any>(pathService)
        .pipe(
          map((response: IHttpResponse) => {
            if (response.status === '00000' && response.data) {
              localStorage.setItem(Keys.currentSessionUser, JSON.stringify(response.data));
              return response.data as IProfile;
            } else {
              return EMPTY;
            }
          }),
          catchError((error) => {
            // TODO: Solución temporal hasta que el servició este expuesto en la nube
            console.log('InfoHomeResolverService > dataGetProfile', 'Error de servicio al obtener información del perfil de usuario en sesión, la información será reemplazada por información mock.');
            const dataMockProfile = (dataGetProfile as any).default;
            localStorage.setItem(Keys.currentSessionUser, JSON.stringify(dataMockProfile));
            return of(dataMockProfile);
          })
        );
    }
  }
}
