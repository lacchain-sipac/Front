import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Alert, Dialog, AlertType, Icon } from './notification.model';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private subject$ = new Subject<Alert>();
  private subjectDiag$ = new Subject<Dialog>();

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.clear();
      }
    });
  }

  getAlert(): Observable<Alert> {
    return this.subject$.asObservable();
  }

  getDialog(): Observable<Dialog> {
    return this.subjectDiag$.asObservable();
  }

  success(message: any, timer = 8000) {
    this.alert(AlertType.success, message, Icon.success, timer);
  }

  error(message: any) {
    this.alert(AlertType.error, message, Icon.error);
  }

  info(message: any, timer = 8000) {
    this.alert(AlertType.info, message, Icon.info, timer);
  }

  warn(message: any, timer = 8000) {
    this.alert(AlertType.warning, message, Icon.warning, timer);
  }

  confirm(message: any, event: () => void, msgSi: string, msgNo: string) {
    this.dialog(AlertType.confirm, message, event, msgSi, msgNo);
  }

  private alert(type: AlertType, message: any, icon: Icon, timer: number = 3000) {
    let messages: Array<string> = [];
    if (message instanceof Array) {
      messages = message;
    } else {
      messages.push(message);
    }

    this.subject$.next({ type, messages, icon } as Alert);

    if (type === AlertType.success || type === AlertType.info) {
      setTimeout(() => {
        this.clear();
      }, timer);
    }
  }

  private clear() {
    this.subject$.next();
  }

  /** Confirm */
  private dialog(type: AlertType, message: string, event: () => void, msgSi: string, msgNo: string) {
    this.subjectDiag$.next({ type, message, event, msgSi, msgNo } as Dialog);
  }
}
