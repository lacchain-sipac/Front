import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { NotificationService } from '@shared/components/notification/notification.service';
import { UserService } from '../user/user.service';
import { AuthenticationService, ParametersService } from '@core/services';
import {
  ICCUser,
  IStatusUser,
  IUser,
  IProfile,
  ICCCompletePassword
} from '@shared/models/common/interfaces';
import {
  IPasswordRequest,
  ILoginRequest
} from '@shared/models/request/interfaces';
import { Keys, CC_USER, CC_COMPLETE_PASSWORD } from '@shared/helpers';

@Component({
  selector: 'kt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title = ' MI PERFIL';
  fgUser: FormGroup;
  ccUser: ICCUser = CC_USER;
  ccCompletePassword: ICCCompletePassword = CC_COMPLETE_PASSWORD;
  statusUser: IStatusUser[];
  activeRole: String;
  textButtonAction = 'Guardar';
  isDisabledRoles = true;
  userRequest: IUser;
  codeRolesSelected: any;

  constructor(
    private fb: FormBuilder,
    private _notificationService: NotificationService,
    private _userService: UserService,
    private _location: Location,
    private parametersService: ParametersService,
    private _authenticationService: AuthenticationService
  ) {
    this.userRequest = {
      company: '',
      fullname: '',
      surnames: '',
      email: '',
      status: { code: 'P' },
      roles: null
    };
  }

  ngOnInit() {
    this.getInfoUser();
    this.getStatusUser();
    this.setValuesDefaultFormBuilder();
  }

  get rolesGroup() {
    return this.fgUser.get('roles') as FormGroup;
  }

  getInfoUser() {
    const user = JSON.parse(
      localStorage.getItem(Keys.currentSessionUser)
    ) as IProfile;
    this.codeRolesSelected = user.roles;
    this.activeRole = JSON.parse(localStorage.getItem(Keys.activeRole));
    this._userService.getUser(user.id).subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        const data: IUser = response.data;
        this.userRequest = data;
        this.setValuesForm();
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  getStatusUser() {
    this.parametersService.getStatusUser().subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        this.statusUser = response.data;
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  setValuesForm() {
    const { email, fullname, surnames, status } = this.userRequest;
    this.fgUser.patchValue({
      email,
      fullname,
      surnames,
      status: status.code,
      roles: this.codeRolesSelected,
      currentPassword: null,
      newPassword: null,
      confirmPassword: null
    });
  }

  setValuesDefaultFormBuilder(): void {
    const pattern = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{0,100}$/;
    this.fgUser = this.fb.group({
      email: [{ value: this.userRequest.email, disabled: true }],
      fullname: [{ value: this.userRequest.fullname, disabled: true }],
      surnames: [{ value: this.userRequest.surnames, disabled: true }],
      status: [{ value: this.userRequest.status.code, disabled: true }],
      currentPassword: ['', Validators.compose([Validators.required])],
      roles: this.fb.group({}),
      newPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(this.ccCompletePassword.password.maxlength),
          Validators.minLength(this.ccCompletePassword.password.minlength),
          Validators.pattern(pattern)
        ])
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(
            this.ccCompletePassword.confirmPassword.maxlength
          ),
          Validators.minLength(
            this.ccCompletePassword.confirmPassword.minlength
          ),
          Validators.pattern(pattern)
        ])
      ]
    });
  }

  async onClickAction() {
    try {
      if (this.validatePasswordsEquality()) {
        this._notificationService.warn(
          'La contraseña no puede ser igual a la actual'
        );
      } else {
        const responseLogin = await this._authenticationService
          .login(this.loginRequest())
          .toPromise();
        if (responseLogin.status === '00000') {
          const responseUpdatePassword = await this._authenticationService
            .processPassword(
              this.completePassworsRequest(),
              this.userRequest.id
            )
            .toPromise();
          if (responseUpdatePassword.status === '00000') {
            const responseNewLogin = await this._authenticationService
              .login(this.newLoginRequest())
              .toPromise();
            if (responseNewLogin.status === '00000') {
              this._notificationService.success(responseUpdatePassword.message);
            } else {
              this._notificationService.warn(
                'Hubo un problema al actualizar la información. Por favor intenta de nuevo'
              );
            }
          } else {
            this._notificationService.warn(responseUpdatePassword.message);
          }
        } else {
          this._notificationService.warn('La contraseña actual no es válida');
        }
      }
    } catch (error) {
      this._notificationService.error(error);
    }
  }

  newLoginRequest(): ILoginRequest {
    const { confirmPassword: password } = this.fgUser.value;
    return { password, username: this.userRequest.email };
  }

  loginRequest(): ILoginRequest {
    const { currentPassword: password } = this.fgUser.value;
    return { password, username: this.userRequest.email };
  }

  completePassworsRequest(): IPasswordRequest {
    const { newPassword, confirmPassword } = this.fgUser.value;
    return { password: newPassword, confirmPassword };
  }

  validatePasswordsEquality() {
    const { newPassword, currentPassword: password } = this.fgUser.value;
    if (newPassword === password) { return true; }
    return false;
  }

  goBack() {
    this._location.back();
  }

  errorForm(field: string, type: string) {
    return this.fgUser.get(field).hasError(type);
  }
}
