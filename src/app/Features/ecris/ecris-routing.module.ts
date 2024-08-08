import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.ECRIS' } },
  { path: 'addEcri', component: CreateComponent, data: { breadcrumb: 'Asset.Addecri' } },
  { path: 'editEcri/:id', component: EditComponent, data: { breadcrumb: 'Asset.Editecri' } },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECRISRoutingModule { }
