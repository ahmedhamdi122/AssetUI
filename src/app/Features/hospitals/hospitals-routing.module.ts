import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListHospitalComponent } from './list/list-hospitals.component';

const routes: Routes = [
  { path: '', component: ListHospitalComponent, data: { breadcrumb: 'Asset.Hospitals' } },
  { path: 'addhospital', component: CreateComponent, data: { breadcrumb: 'Asset.AddHospital' } },
  { path: 'edithospital/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditHospital' } },
  { path: 'viewhospital/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewHospital' } }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalsRoutingModule { }
