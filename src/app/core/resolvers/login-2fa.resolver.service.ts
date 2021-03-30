import { Injectable } from '@angular/core';
import { TokenService } from '@core/services';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Login2FAResolverService {

  constructor(
    private tokenService: TokenService,
    private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const tokenJWT = this.tokenService.token;
    if (tokenJWT && this.tokenService.decodedToken().secretkey) {
      return this.tokenService.decodedToken().secretkey;
    } else {
      this.router.navigate(['/security']);
      return EMPTY;
    }
  }
}
