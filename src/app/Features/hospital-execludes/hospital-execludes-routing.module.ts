import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [

  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.HospitalExeclude' } },
  { path: 'addhospitalexeclude', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'edithospitalexeclude/:id', component: EditComponent, data: { breadcrumb: 'Asset.Edit' } },
  { path: 'viewhospitalexeclude/:id', component: ViewComponent, data: { breadcrumb: 'Asset.View' } },
  { path: 'addhospitalassetexeclude/:id', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalExecludesRoutingModule { }
