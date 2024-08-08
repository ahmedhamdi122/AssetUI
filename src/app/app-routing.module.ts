import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authenticate/login/login.component';
import { AuthGuard } from './Shared/Services/guards/authGuard.guard';
import { ViewComponent } from './Features/errors/view/view.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'errors', component: ViewComponent },
  {
    path: 'dash', loadChildren: () => import('src/app/dashboard/dashboard.module')
      .then(m => m.DashboardModule), canActivate: [AuthGuard]
  },
];
// canActivate: [AuthGuard]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
