import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICCLogin } from '@shared/models/common/interfaces';
import { ILoginRequest } from '@shared/models/request/interfaces';
import { Router } from '@angular/router';
import { CustomValidators, RegularExpression } from '@shared/helpers';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { CC_LOGIN } from '@shared/helpers';
import { NotificationService } from '@shared/components/notification/notification.service';
import { AuthenticationService, TokenService } from '@core/services';
import { environment } from '@environments/environment';

@Component({
  selector: 'kt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  fgLogin: FormGroup;
  isLoginWithQR: boolean;
  ccLogin: ICCLogin = CC_LOGIN;
  version = environment.VERSION;
  _environment = environment.labels.titlePage;
  versionApp = `${this.version} (${this._environment})`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _tokenService: TokenService,
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.setValuesFormBuilder();
  }

  setValuesFormBuilder(): void {
    const pattern = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{0,100}$/;
    this.fgLogin = this.fb.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccLogin.username.maxlength),
        Validators.minLength(this.ccLogin.username.minlength),
        CustomValidators.pattern(RegularExpression.FormatEmail)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccLogin.password.maxlength),
        Validators.minLength(this.ccLogin.password.minlength),
        Validators.pattern(pattern)
      ])]
    });
  }

  fgLoginSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }
    const request = this.loginRequest();
    this.login(request);
  }

  handleSuccessfulLogin() {
    this.router.navigate(['/home']);
  }

  loginRequest(): ILoginRequest {
    const { username, password } = this.fgLogin.value;
    return { username, password };
  }

  login(request: ILoginRequest) {
    this._authenticationService.login(request)
      .subscribe((response: IHttpResponse) => {
        if (response.status === '00000') {
          this.validatUserHasSecretKey();
        } else {
          this._notificationService.warn(response.message);
        }
      }, (error) => {
        this._notificationService.error(error);
      });
  }

  validatUserHasSecretKey() {
    const secretKey = this._tokenService.decodedToken().secretkey;
    return !!secretKey
      ? this.router.navigate(['/security/two-factor-authentication'])
      : this.handleSuccessfulLogin();
  }

  signInKayTrust() {
    this.router.navigate(['/security/auth-with-qr']);
  }

  errorForm(field: string, type: string) {
    return this.fgLogin.get(field).hasError(type);
  }
}
