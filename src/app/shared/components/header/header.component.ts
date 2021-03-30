import { Component, OnInit, Input } from '@angular/core';
import { IMenu, IProfile } from '@shared/models/common/interfaces';
import { AuthenticationService } from '@core/services';
import { Keys } from '@shared/helpers/enums';
import { MENU_USER } from '@shared/helpers/constants'
import { environment } from '@environments/environment';
import { UserService } from '@modules/users/user/user.service';
import { NotificationService } from '../notification/notification.service';
import { Subscription, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { RoleService } from '../../../core/services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() secondHeaderHeight: number;
  profile: IProfile;
  menus: IMenu[] = MENU_USER;
  urlQR: string;
  panelOpenState: boolean;

  version: string = environment.VERSION;
  _environment: string = environment.labels.titlePage;
  versionApp = `${this.version} (${this._environment})`;

  subscription$: Subscription;

  constructor(
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService,
    private _userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) { }

  ngOnInit() {
    this.profile = (JSON.parse(localStorage.getItem(Keys.currentSessionUser))) as IProfile;
  }

  togglePanel($event) {
    $event.stopPropagation();
    this.panelOpenState = !this.panelOpenState;
  }

  menuOpened() {
    this.panelOpenState = false;
    this.subscription$ = interval(20000).pipe(startWith(0)).subscribe(() => this.getStatetToQR());
  }

  menuClosed() {
    this.subscription$.unsubscribe();
  }

  getStatetToQR() {
    this.urlQR = null;
    this._userService.getStateToEnrollKayTrust().subscribe(response => {
      if (response.status === '00000') {
        const env = environment.kaytrust.enroll;
        const state: string = response.data.token;
        const uri = encodeURIComponent(env.params.redirect_uri);
        this.urlQR = `${env.scheme_uri}?state=${state}&redirect_uri=${uri}&title=${env.params.title}&description=${env.params.description}&client_id=${environment.did}`;
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  openOptionMenu(menu: IMenu) {
    this.router.navigate([`home/users/${menu.path}`]);
  }

  logout() {
    this._authenticationService.logout();
  }

  changeRole() {
    this.roleService.openModal();
  }

  get currentRole(): string {
    const codeCurrentRole = JSON.parse(localStorage.getItem(Keys.activeRole));
    if (!this.profile) {
      return 'guest';
    }
    const currenRole = this.profile.roles.find((item) => item.code === codeCurrentRole);
    if (!currenRole) {
      return 'guest';
    }
    return currenRole.name;
  }
}
