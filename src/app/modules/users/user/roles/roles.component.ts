import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IRole, IPrivilegeRole } from '@shared/models/common/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { ParametersService } from '@core/services';

@Component({
  selector: 'kt-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, AfterViewInit {

  @Input() codeRolesSelected: any;
  @Input() rolesFormGroup: FormGroup;
  @Input() disabled: boolean;

  dataRoles: IRole[];
  rolesFG: FormGroup;

  constructor(private _parametersService: ParametersService, private fb: FormBuilder) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.loadDataRoles();
  }

  async loadDataRoles() {
    const response: IHttpResponse = await this._parametersService.getRoles().toPromise();
    this.dataRoles = response.data.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));

    this.dataRoles.forEach((rol, i) => {
      const rolFormGroup: FormGroup = this.fb.group({});
      const rolFormControl: FormControl = this.fb.control({ value: this.verifyRolChecked(rol.code), disabled: this.disabled });

      (rolFormGroup as FormGroup).addControl(rol.code, rolFormControl);
      (this.rolesFormGroup as FormGroup).addControl(rol.code, rolFormGroup);

      if (rol.privileges) {
        const privilegeFormGroup: FormGroup = this.fb.group({});

        this.dataRoles[i].privileges.forEach((privilege, x) => {
          const privilegeFormControl: FormControl = this.fb.control({ value: this.verifyPrivilegeChecked(rol.code, privilege.code), disabled: this.disabled });
          (privilegeFormGroup as FormGroup).addControl(privilege.code, privilegeFormControl);
        });
        (rolFormGroup as FormGroup).addControl('PRIVILEGES', privilegeFormGroup);
      }
    });
    this.rolesFormGroup.updateValueAndValidity();
  }

  verifyRolChecked(rol: string): boolean {
    if (this.codeRolesSelected) {
      return this.codeRolesSelected.some((obj: IRole) => obj.code === rol);
    } else {
      return false;
    }
  }

  verifyPrivilegeChecked(rol: string, privilege: string): boolean {
    if (this.codeRolesSelected) {
      const rolesWithPrivileges: any = this.codeRolesSelected.filter((obj: IRole) => obj.code === rol && obj.privileges !== null);
      if (rolesWithPrivileges.length > 0) {
        return rolesWithPrivileges[0].privileges.some((obj: IPrivilegeRole) => String(obj) === privilege);
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

}
