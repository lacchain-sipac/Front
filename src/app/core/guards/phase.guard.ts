import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from '@core/services';
import { RulesService } from '@core/services/rules.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { actionByUrl } from '@shared/helpers/action-by-url';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhaseGuard implements CanActivate {
  constructor(
    private rulesService: RulesService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthenticationService,
    ){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const { url } = state;
      const isExcecution = url.search('execution');
      const isRequest = url.search('request');
      const phaseName = (isExcecution !== -1) ? 'execution' : ((isRequest !== -1) ? 'request': 'process');
      const action = actionByUrl[phaseName];
        const {code_phase, code_phase_option} = action ;
        return new Promise((resolve, reject) => {
          const userHasAccesSubscription: Subscription = this.rulesService.userHasAccessToPhaseAction(code_phase, code_phase_option).subscribe({
            next: (response) => {
              if (response.status === '00000') {
                if (!response.data.auth) {
                  this.router.navigate(['/home/processes']);
                  this.messageHasNotAccess();
                }
                this.authService.action = phaseName;
                return resolve(response.data.auth);
              } else {
                this.notificationService.warn(response.message);
              }
              userHasAccesSubscription.unsubscribe();
            }
          });
        });
  }

  messageHasNotAccess = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

}
