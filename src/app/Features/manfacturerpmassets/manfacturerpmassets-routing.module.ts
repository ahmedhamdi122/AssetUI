
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateComponent} from './create/create.component';
import {ListComponent} from './list/list.component'; 
import { ManfacturerpmcalendarComponent } from './manfacturerpmcalendar/manfacturerpmcalendar.component';

const routes: Routes = 
[
  // { path: 'manfacturerpmcalendar', component: ManfacturerpmcalendarComponent, data: { breadcrumb: 'Asset.PM' } }
  // {path:"",component:ListComponent,data:{breadcrumb:'Asset.ManfacturerPMList'}},
  {path:"",component:ListComponent,data:{breadcrumb:'Asset.ManfacturerPMList'}},
  {path:"add",component:CreateComponent, data: { breadcrumb: 'Asset.ManfacturerPMCreate' } },
  { path: 'manfacturerpmcalendar', component: ManfacturerpmcalendarComponent, data: { breadcrumb: 'Asset.PM' } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManfacturerpmassetsRoutingModule { }
