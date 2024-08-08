import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteComponent } from './delete/delete.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DeleteComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,

  ],exports: [
    DeleteComponent
  ]
})
export class DeleteModule { }
