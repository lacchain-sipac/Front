import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GuardService } from '@core/services/guard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(private guardService: GuardService, private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.guardService.isUserAdmin){
        return true;
      }else{
        this.router.navigate(['/home/processes']);
        return false;
      }
    }
}
