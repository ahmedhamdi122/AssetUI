import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.Organizations', label: ['Asset.Organizations', 'Asset.heirarchicalstructure'] } },
  { path: 'addorg', component: CreateComponent, data: { breadcrumb: 'Asset.AddOrg' } },
  { path: 'editorg/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditOrg' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
