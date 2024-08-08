import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.HospitalExeclude' } },
  { path: 'addsupplierexeclude', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'editsupplierexeclude/:id/:type', component: EditComponent, data: { breadcrumb: 'Asset.Edit' } },
  { path: 'viewsupplierexeclude/:id/:type', component: ViewComponent, data: { breadcrumb: 'Asset.View' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierExecludesRoutingModule { }
