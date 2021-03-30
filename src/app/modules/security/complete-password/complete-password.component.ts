import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '@environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';
import { AuthenticationService, TokenService } from '@core/services';
import { CC_COMPLETE_PASSWORD } from '@shared/helpers';
import { MatDialog } from '@angular/material';
import { ICCCompletePassword } from '@shared/models/common/interfaces';
import { IPasswordRequest } from '@shared/models/request/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kt-complete-password',
  templateUrl: './complete-password.component.html',
  styleUrls: ['./complete-password.component.scss']
})
export class CompletePasswordComponent implements OnInit {

  fgCompletePassword: FormGroup;
  isOnboarding2FA = false;
  tokenIsExpired: boolean;
  ccCompletePassword: ICCCompletePassword = CC_COMPLETE_PASSWORD;
  idUser: string;
  isAuthenticate: boolean;
  messageToUser = 'Para poder acceder a su cuenta, debe ingresar una nueva contraseña.';
  version: string = environment.VERSION;
  _environment: string = environment.labels.titlePage;
  versionApp = `${this.version} (${this._environment})`;

  constructor(
    public dialog: MatDialog,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private actr: ActivatedRoute,
    private router: Router,
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService
  ) {
    this.actr.data.subscribe(({ accessToken }) => {
      const userData = this.tokenService.decodedToken();
      this.idUser = userData.uuid;
    });
    this.isAuthenticate = this._authenticationService.isAuthenticate;
    this.tokenIsExpired = this.tokenService.isExpired();

    if (this.isAuthenticate) {
      this.messageToUser = 'Actualmente existe una sesión abierta. Cierre la sesión actual para poder continuar con el proceso.';
    }

    if (this.tokenIsExpired && !this.isAuthenticate) {
      this.messageToUser = 'El link ha caducado, si desea restablecer su contraseña vuelva a realizar una nueva solicitud';
    }
  }

  ngOnInit() {
    if (!this.tokenIsExpired) {
      this.createIntervalExpiredToken();
    }
    this.setValuesFormBuilder();
  }

  private createIntervalExpiredToken() {
    const timeToExpired: Subscription = this.tokenService.remainToExpire().subscribe({
      next: (time) => {
        if (time <= 0) {
          this.tokenIsExpired = this.tokenService.isExpired();
          timeToExpired.unsubscribe();
        }
      }
    });
  }

  setValuesFormBuilder(): void {
    const pattern = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{0,100}$/;
    this.fgCompletePassword = this.fb.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccCompletePassword.password.maxlength),
        Validators.minLength(this.ccCompletePassword.password.minlength),
        Validators.pattern(pattern)
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccCompletePassword.confirmPassword.maxlength),
        Validators.minLength(this.ccCompletePassword.confirmPassword.minlength),
        Validators.pattern(pattern)
      ])],
      isActive2FA: [true]
    });
  }

  hideOnbobardingQr2FA(): void {
    this.isOnboarding2FA = false;
  }

  fgCompletePasswordSubmit(fg: FormGroup) {
    const { password, confirmPassword, isActive2FA } = this.fgCompletePassword.value;

    if (fg.invalid) { return true; }
    if (this.fgCompletePassword.controls.isActive2FA.value) {
      this.isOnboarding2FA = !this.isOnboarding2FA;
    } else {
      this.processPassword({ password, confirmPassword, es2FA: isActive2FA });
    }

  }

  generateRequestFronOnboarding(twoFactorAuth): void {
    const { password, confirmPassword, isActive2FA } = this.fgCompletePassword.value;
    const { verifiedCode, secretKey } = twoFactorAuth;
    this.processPassword(
      { password, confirmPassword, verifiedCode, secretKey, es2FA: isActive2FA });
  }

  processPassword(request: IPasswordRequest) {
    this._authenticationService.processPassword(request, this.idUser)
      .subscribe((response: IHttpResponse) => { this.handlePasswordUpdate(response, request.es2FA); },
        (error) => { this._notificationService.error(error); });
  }

  handlePasswordUpdate(response: IHttpResponse, is2FA: boolean) {
    if (response.status === '00000') {
      this._notificationService.success(is2FA
        ? 'Se actualizó su contraseña y se vinculó su dispositivo a su cuenta exitosamente.'
        : 'Se actualizó su contraseña exitosamente.');
      setTimeout(() => {
        localStorage.clear();
        this.router.navigate(['/security']);
      }, 6000);
    } else {
      this._notificationService.warn(response.message);
    }
  }

  errorForm(field: string, type: string) {
    return this.fgCompletePassword.get(field).hasError(type);
  }

  generateNewRequest() {
    this.router.navigate(['/security/forgot-password']);
  }

  logout() {
    this._authenticationService.logout();
  }

}
