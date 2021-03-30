import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { UserService } from '../user.service';
import {
  CustomValidators,
  RegularExpression,
  TYPE_FORM,
} from '@shared/helpers';
import {
  ICCUser,
  IUser,
  IRole,
  IPrivilegeRole,
  IStatusUser,
} from '@shared/models/common/interfaces';
import { CC_USER } from '@shared/helpers';
import {
  IUserNewRequest,
  IUserUpdateRequest,
} from '@shared/models/request/interfaces';
import { NotificationService } from '@shared/components/notification/notification.service';
import { timer, Observable } from 'rxjs';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { ParametersService } from '@core/services/parameters.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'kt-add-view-update-user',
  templateUrl: './add-view-update-user.component.html',
  styleUrls: ['./add-view-update-user.component.scss'],
})
export class AddViewUpdateUserComponent implements OnInit {
  fgUser: FormGroup;
  ccUser: ICCUser = CC_USER;
  isReadOnly = true;
  typeForm: string;
  navigationExtras: NavigationExtras;
  codeRolesSelected: any;
  isDisabledRoles: boolean;
  companies: string[];
  filteredOptions: Observable<string[]>;

  crumbs: Array<string> = ['Usuarios'];
  current: string;

  textButtonAction: string;
  textTitlePage: string;

  userRequest: IUser;
  statusUser: IStatusUser[] = [];

  isEditing = false;
  isViewing = false;
  isCreating = false;

  constructor(
    private fb: FormBuilder,
    private _notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
    private _parametersService: ParametersService
  ) {
    this.typeForm = route.snapshot.data.typeForm;
    this.initPageValues();
  }

  initPageValues() {
    switch (this.typeForm) {
      case TYPE_FORM[0]: // VIEW
        this.isViewing = true;
        this.textButtonAction = 'Editar usuario';
        this.textTitlePage = 'Detalles de usuario';
        this.current = 'Detalles';
        this.isDisabledRoles = true;

        this.getNavigationExtras();
        break;
      case TYPE_FORM[1]: // EDIT
        this.isEditing = true;
        this.textButtonAction = 'Actualizar usuario';
        this.textTitlePage = 'Edición de usuario';
        this.current = 'Edición';

        this.getNavigationExtras();
        break;
      case TYPE_FORM[2]: // NEW
        this.isCreating = true;
        this.textButtonAction = 'Agregar usuario';
        this.textTitlePage = 'Nuevo usuario';
        this.current = 'Nuevo';

        this.userRequest = {
          company: '',
          fullname: '',
          surnames: '',
          email: '',
          status: { code: 'P' },
          roles: null,
          completed: false,
        };

        break;

      default:
        break;
    }
  }

  ngOnInit() {
    this.fgUser = this.setValuesFormBuilder();

    this._userService.listCompanies().subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        this.companies = response.data;
        this.filteredOptions = this.fgUser.controls.company.valueChanges.pipe(
          startWith(''),
          map((company) => this.displayFn(company)),
          map((value) =>
            value ? this.filterOption(value) : this.companies.slice()
          )
        );
      } else {
        this._notificationService.warn(response.message);
      }
    });

    this.getStatusUser();
    this.toDisableInputContractCompany();
  }

  displayFn(company): string {
    if (!company) {
      return '';
    }
    return typeof company === 'string' ? company : company.value;
  }

  private filterOption(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.companies.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  toDisableInputContractCompany() {
    this.rolesGroup.valueChanges.subscribe((values) => {
      const selectedContractOrSup = this.currentContractOrSupRolesSelected(
        values
      );
      if (selectedContractOrSup.length && !this.isViewing) {
        this.fgUser.controls.company.enable();
      } else {
        this.fgUser.controls.company.disable();
      }
    });
  }

  currentContractOrSupRolesSelected = (values) =>
    Object.values(values).filter((role) => {
      const roleCode = Object.keys(role)[0];
      const roleValue = Object.values(role)[0];
      const isRoleContOrSup =
        roleCode === 'ROLE_CONT' || roleCode === 'ROLE_SUP';
      return roleValue && isRoleContOrSup;
    });

  getRolesSelected = () =>
    Object.values(this.rolesGroup.value)
      .filter((role) => Object.values(role)[0])
      .map((role) => Object.keys(role)[0]);

  getNavigationExtras() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      const state = navigation.extras.state as IUser;
      if (state) {
        this.userRequest = state;
        this.codeRolesSelected = this.userRequest.roles;
      } else {
        this.router.navigate(['home/users']);
      }
    } else {
      this.router.navigate(['home/users']);
    }
  }

  setValuesFormBuilder(): FormGroup {
    return this.fb.group({
      email: [
        {
          value: this.userRequest.email,
          disabled: !this.isCreating,
        },
        Validators.compose([
          Validators.required,
          Validators.maxLength(this.ccUser.email.maxlength),
          Validators.minLength(this.ccUser.email.minlength),
          CustomValidators.pattern(RegularExpression.FormatEmail),
        ]),
      ],
      fullname: [
        {
          value: this.userRequest.fullname,
          disabled: this.isViewing,
        },
        Validators.compose([
          Validators.required,
          Validators.maxLength(this.ccUser.fullname.maxlength),
          Validators.minLength(this.ccUser.fullname.minlength),
        ]),
      ],
      surnames: [
        {
          value: this.userRequest.surnames,
          disabled: this.isViewing,
        },
        Validators.compose([
          Validators.required,
          Validators.maxLength(this.ccUser.surnames.maxlength),
          Validators.minLength(this.ccUser.surnames.minlength),
        ]),
      ],
      status: [
        {
          value: this.userRequest.status.code,
          disabled: this.isViewing || this.isCreating,
        },
        Validators.compose([Validators.required]),
      ],
      company: [
        {
          value: this.userRequest.company,
          disabled: this.isViewing,
        },
        [Validators.required],
      ],
      roles: this.fb.group({}),
    });
  }

  errorForm(field: string, type: string) {
    return this.fgUser.get(field).hasError(type);
  }

  userNewRequest(roles: IRole[]): IUserNewRequest {
    const { email, fullname, surnames, status, company } = this.fgUser.value;
    return { email, fullname, surnames, status, roles, company };
  }

  userUpdateRequest(roles: IRole[]): IUserUpdateRequest {
    const { email, fullname, surnames, status, company } = this.fgUser.value;
    return {
      id: this.userRequest.id,
      email,
      fullname,
      surnames,
      status,
      roles,
      company,
    };
  }

  fgUserSubmit(event: FormGroup) {
    const roles: object = event.value.roles;
    const listRoles: IRole[] = this.getValuesRolesAndPrivileges(roles);
    const selectedContractOrSup = this.currentContractOrSupRolesSelected(roles);
    const company = event.value.company;
    const hasCompany =
      typeof company === 'object' ? !!company.value : !!company;

    if (selectedContractOrSup.length && !hasCompany) {
      return this._notificationService.warn(
        `Para el rol contratista y supervisor es necesario contar con una empresa contratista.`
      );
    } else {
      if (this.isEditing) {
        const userUpdateRequest = this.userUpdateRequest(listRoles);
        this.updateUser(userUpdateRequest);
      } else {
        const userNewRequest = this.userNewRequest(listRoles);
        this.newUser(userNewRequest);
      }
    }
  }

  getValuesRolesAndPrivileges(roles): IRole[] {
    const listRoles: IRole[] = [];
    if (Object.keys(roles).length) {
      Object.keys(roles).forEach((keyRol) => {
        if (roles[keyRol][keyRol]) {
          if (roles[keyRol].PRIVILEGES) {
            const listPrivileges: IPrivilegeRole[] = [];
            Object.keys(roles[keyRol].PRIVILEGES).forEach(
              (keyPrivilege: any) => {
                if (roles[keyRol].PRIVILEGES[keyPrivilege]) {
                  listPrivileges.push(keyPrivilege);
                }
              }
            );
            const role: IRole = { code: keyRol, privileges: listPrivileges };
            listRoles.push(role);
          } else {
            const role: IRole = { code: keyRol };
            listRoles.push(role);
          }
        }
      });
    }
    return listRoles;
  }

  payloadToResendInvitation = () => ({
    email: this.userRequest.email,
    roles: this.getRolesSelected(),
    typeNotify: 'INVITATION_USER',
    userId: this.userRequest.id,
    name: `${this.fgUser.controls.fullname.value} ${this.fgUser.controls.surnames.value}`,
  });

  reenviar() {
    const request = this.payloadToResendInvitation();

    this._userService.sendInvitation(request).subscribe((response) => {
      if (response.status === '200') {
        this._notificationService.success(response.message);
        timer(2500).subscribe(() => {
          this.router.navigate(['home/users']);
        });
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  updateUser(userUpdateRequest: IUserUpdateRequest) {
    this._userService
      .updateUser(userUpdateRequest)
      .subscribe((response: IHttpResponse) => {
        if (response.status === '00000') {
          this._notificationService.success(response.message);
          timer(2500).subscribe(() => {
            this.router.navigate(['home/users']);
          });
        } else {
          this._notificationService.warn(response.message);
        }
      });
  }

  newUser(userNewRequest: IUserNewRequest) {
    this._userService
      .addUser(userNewRequest)
      .subscribe((response: IHttpResponse) => {
        if (response.status === '00000') {
          this._notificationService.success(response.message);
          timer(2500).subscribe(() => {
            this.router.navigate(['home/users']);
          });
        } else {
          this._notificationService.warn(response.message);
        }
      });
  }

  getStatusUser() {
    this._parametersService
      .getStatusUser()
      .subscribe((response: IHttpResponse) => {
        if (response.status === '00000') {
          this.statusUser = response.data;
        } else {
          this._notificationService.warn(response.message);
        }
      });
  }

  onClickAction() {
    switch (this.typeForm) {
      case TYPE_FORM[0]: // VIEW
        this.navigationExtras = { state: { ...this.userRequest } };
        this.router.navigate([`home/users/edit`], this.navigationExtras);

        break;
      case TYPE_FORM[1]: // EDIT
        break;
      case TYPE_FORM[2]: // NEW
        break;

      default:
        break;
    }
  }

  get rolesGroup() {
    return this.fgUser.get('roles') as FormGroup;
  }

  filteredStatus(user: IUser) {
    if (!this.statusUser.length) {
      return [];
    }
    if (!user.completed) {
      return this.statusUser.filter((item) => item.code !== 'H');
    }
    return this.statusUser.filter((item) => item.code !== 'P');
  }
}
