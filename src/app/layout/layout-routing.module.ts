import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../authenticate/login/login.component';

const routes: Routes = [

  {
    path: '',
    component: LoginComponent, data: { breadcrumb: 'Asset.Login' },
    children: [
      { path: 'dash', loadChildren: () => import('src/app/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Asset.Home' } },
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
