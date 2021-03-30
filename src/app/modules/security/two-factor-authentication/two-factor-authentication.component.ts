import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';

@Component({
  selector: 'kt-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {
  token = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {}

  handleSuccessfulLogin() {
    this.router.navigate(['/home']);
  }

  fgLoginSubmit() {
    const verifiedCode = parseInt(this.token, 10).toString();
    this.authenticationService.login2FA({verifiedCode})
    .subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
           this.handleSuccessfulLogin();
      } else {
        this.notificationService.warn(response.message);
      }
    });
  }

}
