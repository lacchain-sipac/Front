import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthenticationService } from '@core/services';
import { PhaseService } from '@modules/processes/services/phase.service';
import { actionByUrl } from '@shared/helpers/action-by-url';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad, CanActivate {

  constructor(private _authenticationService: AuthenticationService, private router: Router, private phaseService: PhaseService) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.evalAuth();
  }

  canActivate( route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      const { url } = state;
      const isExcecution = url.search('execution');
      const isRequest = url.search('request');
      const phaseName = (isExcecution !== -1) ? 'execution' : ((isRequest !== -1) ? 'request': 'process');
      const action = actionByUrl[phaseName];

      if(!this._authenticationService.lastUrl){
        this._authenticationService.lastUrl = state.url;
        this.phaseService.phaseName = action ? phaseName : null;
      }
    return this.evalAuth();
  }

  evalAuth(): boolean {
    const isAuthenticate = this._authenticationService.isAuthenticate;
    if (isAuthenticate) { return true; }
    this.router.navigate(['/security']);
    return false;
  }
}
