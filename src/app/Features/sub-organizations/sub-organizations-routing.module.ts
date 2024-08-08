import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatesuborganizationComponent } from './createsuborganization/createsuborganization.component';
import { EditsuborganizationComponent } from './editsuborganization/editsuborganization.component';


const routes: Routes = [
  //  {   path: '', component: ListComponent,data: { breadcrumb: 'List Organizations' }},
  { path: 'addsuborg', component: CreatesuborganizationComponent, data: { breadcrumb: 'Asset.AddSubOrg' } },
  { path: 'editsuborg/:id', component: EditsuborganizationComponent, data: { breadcrumb: 'Asset.EditSubOrg' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubOrganizationsRoutingModule { }
