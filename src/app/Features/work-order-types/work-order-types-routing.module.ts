import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.WorkOrderType' } },
  { path: 'addWorkOrderType', component: CreateComponent, data: { breadcrumb: 'Asset.AddWorkOrderType' } },
  { path: 'editWorkOrderType/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditWorkOrderType' } },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderTypesRoutingModule { }
