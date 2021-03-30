import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WITHOUT_HEADER_PATH } from '@shared/helpers/constants';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isRequestWithoutHeader = path => request.url.includes(path);
    const restrictedHeaderInUse = WITHOUT_HEADER_PATH.filter(isRequestWithoutHeader);
    if (restrictedHeaderInUse.length > 0) {
      return next.handle(request);
    }
    const cloned = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    return next.handle(cloned);
  }
}
