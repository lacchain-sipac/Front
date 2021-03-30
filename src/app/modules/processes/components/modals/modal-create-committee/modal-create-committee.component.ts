import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IMemberCommitteDialog, ICCProcessStepThree } from '@shared/models/common/interfaces';
import { CC_PROCESS_STEP_THREE } from '@shared/helpers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'kt-modal-create-committee',
  templateUrl: './modal-create-committee.component.html',
  styleUrls: ['./modal-create-committee.component.scss']
})
export class ModalCreateCommitteeComponent implements OnInit {

  ccProcessStepThree: ICCProcessStepThree = CC_PROCESS_STEP_THREE;
  committeeMemberForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IMemberCommitteDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalCreateCommitteeComponent>,
  ) { }

  ngOnInit() {
    this.createForm();
    this.updateForm();
  }

  createForm(): void {
    this.committeeMemberForm = this.fb.group({
      id: '',
      role: ['', [Validators.required]],
      detailRole: ['', [Validators.compose([
        Validators.maxLength(this.ccProcessStepThree.detailRole.maxlength),
        Validators.minLength(this.ccProcessStepThree.detailRole.minlength)
      ])]],
      user: ['', [Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccProcessStepThree.userName.maxlength),
        Validators.minLength(this.ccProcessStepThree.userName.minlength)
      ])]],
    });
  }

  updateForm() {
    if (this.data.memberCommittee) {
      const { detailRole, user, role, id } = this.data.memberCommittee;

      this.committeeMemberForm.patchValue({
        detailRole,
        role: role.id,
        user,
        id
      });

      if (this.committeeMemberForm.value.role !== '99') {
        this.committeeMemberForm.controls.detailRole.disable();
      }
    } else {
      this.committeeMemberForm.controls.detailRole.disable();
    }
  }

  rolSelected(event): void {
    if (event.value !== '99') {
      this.committeeMemberForm.controls.detailRole.disable();
      this.committeeMemberForm.get('detailRole').reset();
    } else {
      this.committeeMemberForm.controls.detailRole.enable();
    }
  }

  errorForm(field: string, type: string) {
    return this.committeeMemberForm.get(field).hasError(type);
  }

  closeModal = () => this.dialogRef.close();

  saveForm = () => {
    if (this.committeeMemberForm.valid) {
      this.dialogRef.close(this.committeeMemberForm.value);
    }
  }
}
