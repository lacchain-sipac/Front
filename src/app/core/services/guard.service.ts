import { Injectable } from '@angular/core';
import { Keys } from '@shared/helpers';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  private userAdminRole = 'ROLE_1';

  constructor(private authenticationService: AuthenticationService) { }

  get isUserAdmin() {
    const activeUser = localStorage.getItem(Keys.activeRole);
    return activeUser === JSON.stringify(this.userAdminRole);
  }

  get hasAccessToProcess() {
    const activeUser = localStorage.getItem(Keys.activeRole);
    return activeUser !== JSON.stringify(this.userAdminRole);
  }

  get isAuthAndActive() {
    const existsActiveSession = localStorage.getItem(Keys.currentSessionUser) ? true : false;
    return this.authenticationService.isAuthenticate && existsActiveSession;
  }

}
