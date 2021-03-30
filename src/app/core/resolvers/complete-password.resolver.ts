import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { IHttpResponse } from '@shared/models/response/interfaces/index.js';
import { AuthenticationService } from '@core/services/index.js';
import { Keys } from '@shared/helpers';
import { NotificationService } from '@shared/components/notification/notification.service';

@Injectable({ providedIn: 'root' })
export class CompletePasswordResolverService implements Resolve<any> {

  constructor(private _authenticationService: AuthenticationService, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IHttpResponse> {

    const isAuthenticate = this._authenticationService.isAuthenticate;
    if (!isAuthenticate) {
      const accessToken = route.queryParams['access_token'];

      if (accessToken) {
        localStorage.setItem(Keys.accessToken, accessToken);
        return of(accessToken);
      } else {
        this.router.navigate(['/security']);
        return EMPTY;
      }
    }
  }

}
