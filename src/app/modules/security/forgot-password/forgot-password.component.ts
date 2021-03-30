import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators, RegularExpression } from '@shared/helpers';
import { Router } from '@angular/router';
import { CC_FORGOT_PASSWORD } from '@shared/helpers';
import { ICCForgotPassword } from '@shared/models/common/interfaces';
import { ForgotPasswordService } from './forgot-password.service';
import { IForgotPasswordRequest } from '@shared/models/request/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { NotificationService } from '@shared/components/notification/notification.service';
import { timer } from 'rxjs';


@Component({
  selector: 'kt-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  fgForgotPassword: FormGroup;
  isLoginWithQR: boolean;
  ccForgotPassword: ICCForgotPassword = CC_FORGOT_PASSWORD;
  isDisabled: boolean;

  constructor(private fb: FormBuilder, private router: Router,
              private _forgotPasswordService: ForgotPasswordService,
              private _notificationService: NotificationService) { }

  ngOnInit() {
    localStorage.clear();
    this.setValuesFormBuilder();
  }

  setValuesFormBuilder(): void {
    this.fgForgotPassword = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccForgotPassword.email.maxlength),
        Validators.minLength(this.ccForgotPassword.email.minlength),
        CustomValidators.pattern(RegularExpression.FormatEmail)
      ])]
    });
  }

  fgForgotPasswordSubmit(fg: FormGroup) {
    if (fg.invalid) { return true; }
    const request = this.forgotPasswordRequest();
    this.forgotPassword(request);
  }

  forgotPasswordRequest(): IForgotPasswordRequest {
    const { email } = this.fgForgotPassword.value;
    return { email };
  }

  forgotPassword(request: IForgotPasswordRequest) {
    this._forgotPasswordService.forgotPassword(request)
      .subscribe((response: IHttpResponse) => {
        if (response.status === '00000') {
          this.isDisabled = true;
          this._notificationService.success(response.message, 5000);
          timer(5000).subscribe(() => {
            this.router.navigate(['/security']);
          });
        } else {
          this._notificationService.warn(response.message);
        }
      });
  }

  errorForm(field: string, type: string) {
    return this.fgForgotPassword.get(field).hasError(type);
  }

}
