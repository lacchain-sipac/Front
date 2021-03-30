import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService, AuthenticationService } from '@core/services';
import { environment } from '@environments/environment';
import { NotificationService } from '@shared/components/notification/notification.service';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-login-with-qr',
  templateUrl: './login-with-qr.component.html',
  styleUrls: ['./login-with-qr.component.scss']
})
export class LoginWithQrComponent implements OnInit, OnDestroy {

  urlQR: string;
  version = environment.VERSION;
  _environment = environment.labels.titlePage;
  versionApp = `${this.version} (${this._environment})`;

  constructor(
    private router: Router,
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService,
    private _webSocketService: WebSocketService,
  ) { }

  ngOnInit() {
    this.subscribeWebSocket();
  }

  ngOnDestroy() {
    this._webSocketService.closeConnection();
  }

  signInWithEmail() {
    this.router.navigate(['/security']);
  }

  subscribeWebSocket() {
    this._webSocketService.connect()
      .subscribe(messages => {
        if (messages && messages.id) {
          const env = environment.kaytrust.auth;
          const state: string = messages.id;
          const uri = encodeURIComponent(env.params.redirect_uri);
          this.urlQR = `${env.domainShare}?state=${state}&redirect_uri=${uri}&title=${env.params.title}&description=${env.params.description}&client_id=${environment.did}`;
        }

        if (messages && messages.token) {
          this.loginJwt(messages.token);
        }

      }, error => {
        this._notificationService.error(error);
      }, () => { });

    this._webSocketService.send({ message: 'GET_STATE' });
  }

  handleSuccessfulLogin() {
    this.router.navigate(['/home']);
  }

  loginJwt(jwt: string) {
    this._authenticationService.loginJWT(jwt)
      .subscribe((response: IHttpResponse) => {
        if (response.status === '00000') {
          this.handleSuccessfulLogin();
        } else {
          this._notificationService.warn(response.message);
        }
      }, (error) => {
        this._notificationService.error(error);
      });
  }


}
