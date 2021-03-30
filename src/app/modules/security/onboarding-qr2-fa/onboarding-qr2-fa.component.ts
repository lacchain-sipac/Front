import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as base32 from 'hi-base32';
import { generateRandomKey } from '@shared/helpers';
import { TokenService } from '@core/services/token.service';

@Component({
  selector: 'kt-onboarding-qr2-fa',
  templateUrl: './onboarding-qr2-fa.component.html',
  styleUrls: ['./onboarding-qr2-fa.component.scss']
})
export class OnboardingQr2FAComponent implements OnInit {
  urlQR: string;
  secretKey: string;
  verificationCode: string;
  currentEmail: string;
  @Output() authenticate2FA = new EventEmitter();
  @Output() hideOnbobardingQr2FA = new EventEmitter();

  constructor(
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.generateUrlQr();
  }

  authenticate() {
    const verifiedCode = parseInt(this.verificationCode, 10).toString();
    const twoFactorAuth = {
      verifiedCode,
      secretKey: this.secretKey
    };

    this.authenticate2FA.emit(twoFactorAuth);
  }

  hideOnbobarding() {
    this.hideOnbobardingQr2FA.emit();
  }

  generateUrlQr = (): void => {
    const randomKey = generateRandomKey();
    this.secretKey = base32.encode(randomKey);
    this.currentEmail = this.tokenService.decodedToken().sub;
    this.urlQR = `otpauth://totp/SIPAC:${this.currentEmail}?secret=${this.secretKey}`;
  }

}
