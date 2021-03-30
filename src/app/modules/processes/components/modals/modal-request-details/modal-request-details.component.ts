import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-modal-request-details',
  templateUrl: './modal-request-details.component.html',
  styleUrls: ['./modal-request-details.component.scss']
})
export class ModalRequestDetailsComponent implements OnInit {

  process: any;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ModalRequestDetailsComponent>,
  ) { }

  ngOnInit() {
  }

  closeModal = () => this.dialogRef.close();

}
