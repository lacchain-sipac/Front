import { Injectable } from '@angular/core';
import { ParametersService } from '@core/services';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParameterRulesResolverService {

  constructor(
    private parametersService: ParametersService,
    private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.parametersService.getRules('PRY_HONDURAS').pipe(
      retry(5),
      take(1),
      mergeMap(response => {
        if (response.status === '00000') {
          return of(response.data);
        }
        this.router.navigate(['home/processes']);
        return EMPTY;
      })
    );
  }
}
