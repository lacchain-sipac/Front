import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards';
import { IsAdminGuard } from '@core/guards/is-admin.guard';
import { IsUserGuard } from '@core/guards/is-user.guard';
import { ProfileResolverService } from '@core/resolvers';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    resolve: { auth: ProfileResolverService },
    children: [
      {
        path: 'users',
        loadChildren: () => import('@modules/users/users.module').then(mod => mod.UsersModule),
        canActivate: [IsAdminGuard],
      },
      {
        path: 'processes',
        loadChildren: () => import('@modules/processes/processes.module').then(mod => mod.ProcessesModule),
        canActivate: [IsUserGuard],
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'security',
    loadChildren: () => import('@modules/security/security.module').then(mod => mod.SecurityModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
