import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  ILoginRequest,
  IPasswordRequest,
  ILogin2FARequest,
} from '@shared/models/request/interfaces';
import { Observable, timer, Subscription } from 'rxjs';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { DataService } from './data.service';
import {
  PATH_ENDPOINTS_AUTH,
  Keys,
  PATH_ENDPOINTS_USERS,
} from '@shared/helpers';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { String } from 'typescript-string-operations';
import { TokenService } from './token.service';
import { MatDialog } from '@angular/material';
import { ModalSessionComponent } from '../../shared/components/modal-session/modal-session.component';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  isAuthenticate: boolean;
  subscription: Subscription;
  subscriptionModal: Subscription;
  timeToExpire: number;
  lastUrl: string;
  action: string;

  constructor(
    private dataService: DataService,
    private router: Router,
    private tokenService: TokenService,
    private dialog: MatDialog
  ) {
    this.isAuthenticate = JSON.parse(localStorage.getItem(Keys.isAuthenticate));
  }

  login(request: ILoginRequest): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.security}${PATH_ENDPOINTS_AUTH.auth}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);
    return this.dataService.execPostJson(parameters).pipe(
      tap(({ data }) => {
        if (data) {
          this.setAccesToken(data.token);
          const secretKey = this.tokenService.decodedToken().secretkey;

          if (!secretKey) {
            this.setSession();
          }
        }
      })
    );
  }

  login2FA(request: ILogin2FARequest): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.security}${PATH_ENDPOINTS_AUTH.auth2FA}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);
    return this.dataService.execPostJson(parameters).pipe(
      tap((response) => {
        if (response.status === '00000') {
          this.setSession();
        }
      })
    );
  }

  loginJWT(token: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.security}${PATH_ENDPOINTS_AUTH.authJwt}`;
    const parameters: string = JSON.stringify({ token });
    this.dataService.set(pathService);
    return this.dataService.execPostJson(parameters).pipe(
      tap(({ data }) => {
        if (data) {
          this.setSession();
          this.setAccesToken(data.token);
        }
      })
    );
  }

  setAccesToken(token: string) {
    localStorage.setItem(Keys.accessToken, token);
    this.createIntervalModal();
    this.createIntervalLogout();
  }

  setSession() {
    this.isAuthenticate = true;
    localStorage.setItem(
      Keys.isAuthenticate,
      JSON.stringify(this.isAuthenticate)
    );
  }

  processPassword(
    request: IPasswordRequest,
    idUser: string
  ): Observable<IHttpResponse> {
    request.type = 'COMPLETE_PASSWORD';
    const pathService = `${environment.pathApis.users}${String.Format(
      PATH_ENDPOINTS_USERS.password,
      idUser
    )}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);
    return this.dataService.execPutJson(parameters);
  }

  logout() {
    const pathService = `${environment.pathApis.security}${PATH_ENDPOINTS_AUTH.logout}`;
    this.dataService.set(pathService);
    return this.dataService
      .execPostJson()
      .pipe(
        tap((response) => {
          if (response.status === '00000') {
            this.cleanSessionLocalStorage();
          }
        })
      )
      .subscribe();
  }

  cleanSessionLocalStorage() {
    this.isAuthenticate = false;
    this.dialog.closeAll();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionModal) {
      this.subscriptionModal.unsubscribe();
    }
    localStorage.clear();
    this.router.navigate(['/security']);
  }

  private createIntervalModal() {
    const timeToRemenber = this.tokenService.timeToAlert();
    if (this.subscriptionModal) {
      this.subscriptionModal.unsubscribe();
    }
    this.subscriptionModal = timer(timeToRemenber).subscribe({
      next: () => {
        this.openModalRefresh();
      },
    });
  }

  openModalRefresh() {
    const id = 'refreshToken';
    const dialog = this.dialog.getDialogById(id);
    if (!dialog) {
      const dialogRef = this.dialog.open(ModalSessionComponent, {
        disableClose: true,
        id,
        minWidth: 500,
      });
      dialogRef.afterClosed().subscribe((action: boolean) => {
        if (action) {
          this.refreshToken();
        }
      });
    }
  }

  private createIntervalLogout() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.tokenService
      .remainToExpire()
      .subscribe((timeToExpire) => {
        this.timeToExpire = timeToExpire;
        if (this.timeToExpire <= 0 && this.isAuthenticate) {
          this.logout();
        }
      });
  }

  refreshToken() {
    const pathService = `${environment.pathApis.security}${PATH_ENDPOINTS_AUTH.refreshToken}`;
    this.dataService.set(pathService);
    return this.dataService
      .execPostJson()
      .pipe(
        tap(({ data }) => {
          if (data) {
            this.setAccesToken(data.token);
          }
        })
      )
      .subscribe();
  }
}
