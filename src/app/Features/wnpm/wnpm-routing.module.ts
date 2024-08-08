import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { WnpmcalendarComponent } from './wnpmcalendar/wnpmcalendar.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.PM' } },
  { path: 'wnpmcalndr', component: WnpmcalendarComponent, data: { breadcrumb: 'Asset.PM' } },
  { path: 'add', component: CreateComponent, data: { breadcrumb: 'Asset.PM' } }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WnpmRoutingModule { }
