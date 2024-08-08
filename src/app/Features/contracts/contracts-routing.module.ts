import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewContractComponent } from './view/view-contract.component';
import { ContractDetailsComponent } from './details/contract-details.component';


const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.Contracts' } },
  { path: 'addcontract', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'editcontract/:id', component: EditComponent, data: { breadcrumb: 'Asset.Edit' } },
  { path: 'viewcontracts', component: ViewContractComponent, data: { breadcrumb: 'Asset.View' } },
  { path: 'detail/:id', component: ContractDetailsComponent, data: { breadcrumb: 'Asset.View' } },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
