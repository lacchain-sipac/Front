import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Keys } from '@shared/helpers';
import { IProfile, IRole } from '@shared/models/common/interfaces';

import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'kt-modal-role',
  templateUrl: './modal-role.component.html',
  styleUrls: ['./modal-role.component.scss']
})
export class ModalRoleComponent implements OnInit {

  formRole: FormGroup;
  roles: IRole[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalRoleComponent>,
    private notifyService: NotificationService
    ) { }

  ngOnInit() {
    this.formRole = this.createForm();
    const user = JSON.parse(localStorage.getItem(Keys.currentSessionUser)) as IProfile;
    this.roles = user.roles;
  }

  private createForm() {
    return this.fb.group({
      role: ['', Validators.required]
    });
  }

  get invalidForm() {
    return this.formRole.invalid;
  }

  closeModal() {
    const currentRole = localStorage.getItem(Keys.activeRole);
    if (!currentRole) {
      return this.notifyService.error('Debe elegir un rol cuando inicia sesión');
    }
    this.dialogRef.close();
  }

}
