import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ModalRoleComponent } from '@shared/components/modal-role/modal-role.component';

import { GuardService } from './guard.service';
import { Keys } from '../../shared/helpers';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private dialog: MatDialog,
    private guardService: GuardService,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  private currentRole = new BehaviorSubject<string>(null);
  public currentActiveRole = JSON.parse(localStorage.getItem(Keys.activeRole));

  get activeRole(): Observable<string> {
    return this.currentRole.asObservable();
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalRoleComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((role: string) => {
      if (role) {
        this.setCurrentRole(role);
        this.navigateToHome();
      }
    });
  }

  private navigateToHome() {

    let route = this.authService.lastUrl;
    const action = this.authService.action;
    if(!route || route === '/home'){
      route = this.guardService.isUserAdmin ? 'home/users' : 'home/processes';
    }
    this.authService.lastUrl = null;
    this.router.navigate([route], {state: {phaseName: action }});
  }

  resolveRouteByRole() {
    const currentRole = localStorage.getItem(Keys.activeRole);
    if (currentRole) {
      this.navigateToHome();
    } else {
      this.openModal();
    }
  }

  setCurrentRole(role: string) {
    localStorage.setItem(Keys.activeRole, JSON.stringify(role));
    this.getCurrentActiveRole(role);
  }

  public getCurrentActiveRole(role: string): void {
    this.updateCurrentActiveRole(role);
  }

  private updateCurrentActiveRole(role: string): void {
    this.currentActiveRole = role;
    this.currentRole.next(role);
  }

  get isAdmin(){
    return this.guardService.isUserAdmin;
  }
}
