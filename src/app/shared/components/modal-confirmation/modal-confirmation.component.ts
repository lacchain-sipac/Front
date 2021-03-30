import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDialogData } from '@shared/models/common/interfaces';


@Component({
  selector: 'kt-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {

  public observation: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialogRef: MatDialogRef<ModalConfirmationComponent>,
  ) { }

  ngOnInit() {
  }

  closeModal = () => this.dialogRef.close();

  saveForm = () => this.dialogRef.close('execution');
}
