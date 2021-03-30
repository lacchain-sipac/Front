import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TokenService } from '@core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'kt-modal-session',
  templateUrl: './modal-session.component.html',
  styleUrls: ['./modal-session.component.scss'],
})
export class ModalSessionComponent implements OnInit {
  timeToExpire$: Observable<number>;

  units = {
    minutes: 'minutos',
    seconds: 'segundos',
    hours: 'horas',
  };

  constructor(
    private dialogRef: MatDialogRef<ModalSessionComponent>,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.timeToExpire$ = this.tokenService.remainToExpire();
  }

  close(action: boolean) {
    this.dialogRef.close(action);
  }

  getUnit(value): string {
    return this.units[value];
  }
}
