import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService, AuthenticationService } from '@core/services';
import { finalize } from 'rxjs/operators';
import { PATH_ENDPOINTS_AUTH, Keys } from '@shared/helpers';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  private helper = new JwtHelperService();

  constructor(public loaderService: LoaderService, private _authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    const isLogin2FA = request.url.includes(PATH_ENDPOINTS_AUTH.auth2FA);
    const isAuthService = request.url.includes(PATH_ENDPOINTS_AUTH.auth);
    const isAuthServiceExeception2FA = isAuthService && !isLogin2FA;
    const accessToken = localStorage.getItem(Keys.accessToken);

    if (accessToken && this.helper.isTokenExpired(accessToken)) {
      this.loaderService.hide();
      this._authenticationService.cleanSessionLocalStorage();
    }

    const returnRequest = requestObject => {
      return next.handle(requestObject).pipe(
        finalize(() => this.loaderService.hide())
      );
    };

    if (isAuthServiceExeception2FA || !accessToken) {
      return returnRequest(request);
    }

    const cloned = request.clone({
      headers: request.headers.set('Authorization', accessToken)
    });
    return returnRequest(cloned);
  }
}
