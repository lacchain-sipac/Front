import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from '@modules/users/user/list-user/list-user.component';
import { AddViewUpdateUserComponent } from './user/add-view-update-user/add-view-update-user.component';
import { TYPE_FORM } from '@shared/helpers';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ListUserComponent
  },
  {
    path: 'view',
    component: AddViewUpdateUserComponent,
    data: { typeForm: TYPE_FORM[0] }
  },
  {
    path: 'edit',
    component: AddViewUpdateUserComponent,
    data: { typeForm: TYPE_FORM[1] }
  },
  {
    path: 'new',
    component: AddViewUpdateUserComponent,
    data: { typeForm: TYPE_FORM[2] }
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsersRoutingModule { }
