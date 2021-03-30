import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSelectChange } from '@angular/material';
import { NavigationExtras, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser, IStatusUser } from '@shared/models/common/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { ListColumn } from '@shared/models/common/classes';
import { NotificationService } from '@shared/components/notification/notification.service';
import { COLUMNS_USER } from '@shared/helpers';
import { ParametersService } from '@core/services/parameters.service';

@Component({
  selector: 'kt-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, AfterViewInit {

  title = 'Gestión de usuarios';
  dataSource = new MatTableDataSource<IUser>();
  navigationExtras: NavigationExtras;

  crumbs: Array<string> = [];
  current = 'Usuarios';
  statusUser: IStatusUser[] = [];

  columns: ListColumn[] = COLUMNS_USER as ListColumn[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private _userService: UserService,
    private _notificationService: NotificationService,
    private parametersService: ParametersService) {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.getUsers();
    this.getStatusUser();
  }

  getUsers() {
    this._userService.listUsers().subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        const data: IUser[] = response.data;
        this.dataSource.data = data;
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  getStatusUser() {
    this.parametersService.getStatusUser().subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        this.statusUser = response.data;
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  onChangeStatus(id: string, $event: MatSelectChange) {
    this._notificationService.confirm('¿Está seguro que desea actualizar el estado del usuario seleccionado?',
      () => {
        this.updateUserStatus(id, $event.value);
      }, 'Si, actualizar', 'No');
  }

  updateUserStatus(id: string, status: string) {
    this._userService.updateUserStatus(id, status).subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        this._notificationService.success(response.message);
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  getValueRow(row: IUser, col: ListColumn) {
    // TODO: Para el caso de roles esta pendiente acordar que presentación tendrá, tooltip o todos los roles concatenados
    switch (row[col.property]) {
      case row.roles:
        return row.roles[0].name;
      case row.fullname:
        return `${row.fullname} ${row.surnames}`;
      default:
        return row[col.property];
    }
  }

  onClickViewEditUser(row: IUser, isEdit: boolean) {
    this._userService.getUser(row.id).subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        this.navigationExtras = { state: { ...response.data } };
        if (isEdit) {
          this.router.navigate([`home/users/edit`], this.navigationExtras);
        } else {
          this.router.navigate([`home/users/view`], this.navigationExtras);
        }
      } else {
        this._notificationService.warn(response.message);
      }
    });
  }

  sortData(event) {
    // TODO: por Implementar
  }

  onFilterChange(filterValue: string) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get hasData() {
    return this.dataSource && this.dataSource.data.length > 0;
  }

  filteredStatus(user: IUser) {
    if (!this.statusUser.length) {
      return;
    }
    if (!user.completed) {
      return this.statusUser.filter((item => item.code !== 'H'));
    }
    return this.statusUser.filter((item => item.code !== 'P'));
  }

}
