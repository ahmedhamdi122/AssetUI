import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  // { path: 'roles', loadChildren: () => import('src/app/Features/role-categories/role-categories.module').then(m => m.RoleCategoriesModule),data: { breadcrumb: 'Login' }}
  { path: 'forget', component: ForgetPasswordComponent, data: { breadcrumb: 'Asset.Forget' } },
  { path: 'reset', component: ResetPasswordComponent, data: { breadcrumb: 'Asset.Reset' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: []
})
export class AuthenticateRoutingModule { }
