import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Alert, Dialog, Icon, AlertType } from './notification.model';
import { NotificationService } from './notification.service';
import { LoaderService } from '@core/services';


@Component({
  selector: 'kt-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent implements OnInit {

  alert: Alert;
  dialog: Dialog;
  showBackdrop: boolean;

  constructor(
    private _notificationService: NotificationService,
    private _loaderService: LoaderService,
    private ref: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.alert = new Alert();
    this.dialog = new Dialog();

    this._notificationService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        this.alert.messages = [];
        this.showBackdrop = false;
        this.ref.detectChanges();
        return;
      }
      this.showBackdrop = true;
      this.alert = alert;
      this.ref.detectChanges();
    });

    /* Dialog */
    this._notificationService.getDialog().subscribe((dialog: Dialog) => {
      if (!dialog) {
        this.dialog.message = '';
        this.showBackdrop = false;
        this.ref.detectChanges();
        return;
      }
      this.showBackdrop = true;
      this.dialog = dialog;
      this.ref.detectChanges();
    });
  }

  onCloseMsg() {
    this.showBackdrop = false;
    this.removeAlert();
  }

  removeAlert() {
    this.showBackdrop = false;
    this.alert.messages = [];
    this.ref.detectChanges();
  }

  get cssClassNotification() {
    if (!this.alert) {
      return;
    }

    switch (this.alert.type) {
      case AlertType.success:
        return this.alert.messages.length > 0 ? 'view-notification success' : '';
      case AlertType.error:
        return this.alert.messages.length > 0 ? 'view-notification error' : '';
      case AlertType.info:
        return this.alert.messages.length > 0 ? 'view-notification info' : '';
      case AlertType.warning:
        return this.alert.messages.length > 0 ? 'view-notification warning' : '';
    }
  }

  get iconNotification() {
    if (!this.alert) {
      return;
    }

    switch (this.alert.icon) {
      case Icon.success:
        return 'check';
      case Icon.error:
        return 'clear';
      case Icon.info:
        return 'info';
      case Icon.warning:
        return 'warning';
    }
  }

  get backdropClass() {
    return this.showBackdrop ? 'showBackdrop' : 'hideBackdrop';
  }

  /* Dialog */
  onNoDialog() {
    this.showBackdrop = false;
    this._loaderService.hide();
    this.removeDialog();
  }

  onSiDialog() {
    this.showBackdrop = false;
    this._loaderService.hide();
    this.dialog.event();
    this.removeDialog();
  }

  removeDialog() {
    this.showBackdrop = false;
    this.dialog.message = '';
    this.ref.detectChanges();
  }

  get cssClassDialog() {
    if (!this.dialog) {
      return;
    }
    return this.dialog.message !== '' ? 'view-notification confirm' : '';
  }

  get isConfirmDialog() {
    return this.dialog.type === AlertType.confirm;
  }

  get isConfirmAlert() {
    return this.alert.type === AlertType.confirm;
  }

}
