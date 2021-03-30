import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletePasswordResolverService, Login2FAResolverService } from '@core/resolvers';
import { LoginComponent } from '@modules/security/login/login.component';

import { CompletePasswordComponent } from './complete-password/complete-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginWithQrComponent } from './login-with-qr/login-with-qr.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'auth-with-qr',
    component: LoginWithQrComponent,
  },
  {
    path: 'two-factor-authentication',
    component: TwoFactorAuthenticationComponent,
    resolve: { secretKey: Login2FAResolverService }
  },
  {
    path: 'complete-password',
    component: CompletePasswordComponent,
    resolve: { idUser: CompletePasswordResolverService }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SecurityRoutingModule { }
