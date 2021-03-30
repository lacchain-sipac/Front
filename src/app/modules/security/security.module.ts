import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '@modules/security/login/login.component';
import { SecurityRoutingModule } from '@modules/security/security-routing.module';
import {
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from '@angular/material';
import { SharedModule } from '@shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CompletePasswordComponent } from './complete-password/complete-password.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { LoginWithQrComponent } from './login-with-qr/login-with-qr.component';
import { OnboardingQr2FAComponent } from './onboarding-qr2-fa/onboarding-qr2-fa.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    CompletePasswordComponent,
    TwoFactorAuthenticationComponent,
    LoginWithQrComponent,
    OnboardingQr2FAComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecurityRoutingModule,
    QRCodeModule,

    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
})

export class SecurityModule { }
