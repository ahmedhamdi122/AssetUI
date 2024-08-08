import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.WorkOrderStatus' } },
  { path: 'addWorkOrderStatus', component: CreateComponent, data: { breadcrumb: 'Asset.AddWorkOrderStatus' } },
  { path: 'editWorkOrderStatus/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditWorkOrderStatus' } },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrderStatusRoutingModule { }
