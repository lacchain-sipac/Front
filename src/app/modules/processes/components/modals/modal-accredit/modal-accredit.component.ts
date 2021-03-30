import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CC_ACCREDIT_DIALOG } from '@shared/helpers';
import {
  IDialogData,
  ICCAccreditDialog,
} from '@shared/models/common/interfaces';

@Component({
  selector: 'kt-modal-accredit',
  templateUrl: './modal-accredit.component.html',
  styleUrls: ['./modal-accredit.component.scss'],
})
export class ModalAccreditComponent implements OnInit {
  accreditForm: FormGroup;
  ccAccreditDialog: ICCAccreditDialog = CC_ACCREDIT_DIALOG;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialogRef: MatDialogRef<ModalAccreditComponent>
  ) { }

  ngOnInit() {
    this.accreditForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      isAccredit: [false, [Validators.required]],
      observation: [
        '',
        !!this.data.isAccreditRequest ? [Validators.required] : [],
      ],
    });
  }

  changeIsAccredit = (event) => {
    const observationControl = this.accreditForm.get('observation');

    if (event.target.checked) {
      observationControl.clearValidators();
      observationControl.setErrors(null);
    } else {
      observationControl.setValidators([Validators.required]);
    }
  };

  errorForm(field: string, type: string) {
    return this.accreditForm.get(field).hasError(type);
  }

  closeModal = () => this.dialogRef.close();

  saveForm() {
    const payload = !!this.data.isAccreditRequest
      ? {
        isAccredit: this.accreditForm.value.isAccredit,
        observation: this.accreditForm.value.observation,
      }
      : { observation: this.accreditForm.value.observation };

    this.validateToCloseModal(payload);
  }

  closeModalIsAccreditRequest(payload) {
    if (this.accreditForm.value.isAccredit) {
      this.dialogRef.close(payload);
    }
    if (!this.accreditForm.value.isAccredit && !!this.accreditForm.value.observation) {
      this.dialogRef.close(payload);
    }
  }

  validateToCloseModal(payload) {
    if (this.data.textButtonExecution === 'Observar') {
      if (!!this.accreditForm.value.observation) {
        this.dialogRef.close(payload);
      }
    } else {
      if (!!this.data.isAccreditRequest) {
        this.closeModalIsAccreditRequest(payload);
      } else {
        this.dialogRef.close(payload);
      }
    }
  }
}
