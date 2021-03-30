import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class NewTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter((event) => event instanceof HttpResponse),
      tap((event: HttpResponse<any>) => {
        const newToken = event.headers.get('new-token');
        if (newToken) {
          this.authService.setAccesToken(newToken);
          this.authService.setSession();
        }
      })
    );
  }
}
