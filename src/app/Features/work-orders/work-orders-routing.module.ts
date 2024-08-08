import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { ListWOComponent } from './list/listwo.component';
import { CreateWOComponent } from './create/createwo.component';


const routes: Routes = [
  { path: '', component: ListWOComponent, data: { breadcrumb: 'Asset.WorkOrders' } },
  { path: 'editworkorder/:workOrderId', component: EditComponent, data: { breadcrumb: 'Asset.EditWorkOrder' } },
  { path: 'editworkorder/:requestId', component: EditComponent, data: { breadcrumb: 'Asset.EditWorkOrder' } },
  { path: 'addWorkOrder/:requestId', component: CreateWOComponent, data: { breadcrumb: 'Asset.AddWorkOrder' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrdersRoutingModule { }
