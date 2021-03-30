import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { getPathUrl } from '@shared/helpers';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TokenService } from './core/services/token.service';
import { AuthenticationService } from '@core/services/authentication.service.ts';
import { VIEWS_WITH_HIGHT_HEADER } from '@shared/helpers/constants';


@Component({
  selector: 'kt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = environment.labels.titlePage;
  isVisibleHeader: boolean;
  isVisibleFooter: boolean;
  secondHeaderHeight = 160;

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthenticationService
  ) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url: string = event.url;
        const path: string = getPathUrl(url);

        if (this.tokenService.isExpired() && !path.includes('security')) {
          this.authService.cleanSessionLocalStorage();
        }

        this.setHeaderVisibility(path);
        this.setSecondHeaderVisibility(url);
      });
  }

  setSecondHeaderVisibility(path) {
    this.secondHeaderHeight = VIEWS_WITH_HIGHT_HEADER.includes(path) ? 160 : 0;
  }

  hasHeaderAndFooter(path) {
    return !path.startsWith('security');
  }

  setHeaderVisibility(path: string) {
    const hasNotHeaderAndFooter = this.hasHeaderAndFooter(path);
    this.isVisibleHeader = hasNotHeaderAndFooter;
    this.isVisibleFooter = hasNotHeaderAndFooter;
  }
}
