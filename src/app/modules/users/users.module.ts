import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from '@modules/users/users-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatAutocompleteModule } from '@angular/material';
import { AddViewUpdateUserComponent } from '@modules/users/user/add-view-update-user/add-view-update-user.component';
import { ListUserComponent } from '@modules/users/user/list-user/list-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RolesComponent } from './user/roles/roles.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AddViewUpdateUserComponent,
    ListUserComponent,
    RolesComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule
  ]
})

export class UsersModule { }
