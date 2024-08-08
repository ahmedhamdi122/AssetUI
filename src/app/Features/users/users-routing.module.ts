import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.Users' } },
  { path: 'adduser', component: CreateComponent, data: { breadcrumb: 'Asset.AddUser' } },
  { path: 'edituser/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditUser' } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
