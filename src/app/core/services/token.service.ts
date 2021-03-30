import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { interval, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Keys } from '@shared/helpers';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  get token() {
    return localStorage.getItem(Keys.accessToken);
  }

  decodedToken() {
    return helper.decodeToken(this.token) || null;
  }

  isExpired() {
    return helper.isTokenExpired(this.token);
  }

  expirationDate() {
    return helper.getTokenExpirationDate(this.token);
  }

  /**
   * Retorna el tiempo en milisegundos cuando debe ser alertado al usuario acerca de su sesion
   */
  timeToAlert() {
    const timeToAlert = this.timeOfLife() - environment.timeToRememberSession;
    return timeToAlert;
  }

  /**
   * retorna el tiempo de vida del token en milisegundos
   */
  timeOfLife() {
    const { exp, iat } = this.decodedToken();
    const timeOfLife = exp * 1000 - iat * 1000; // 3000000
    return timeOfLife;
  }

  /**
   * Retorna el tiempo (en segundos) faltante para expirar
   */
  remainToExpire() {
    const decodedToken = this.decodedToken();
    if (decodedToken) {
      return interval(1000).pipe(
        map(() =>
          Math.round((decodedToken.exp * 1000 - new Date().getTime()) / 1000)
        )
      );
    }
    return of(0);
  }
}
