import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Keys } from '@shared/helpers';

@Injectable()
export class RoleInterceptor implements HttpInterceptor {

  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const role = JSON.parse(localStorage.getItem(Keys.activeRole));
    if (role) {
      const cloned = request.clone({ headers: request.headers.set('role', role)});
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}
