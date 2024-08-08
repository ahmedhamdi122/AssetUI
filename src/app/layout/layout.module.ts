import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';


import { FlexLayoutModule } from '@angular/flex-layout';



import { LayoutComponent } from './layout.component';
import { TopheaderComponent } from './topheader/topheader.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { BadgeModule } from 'primeng/badge';
import { MatBadgeModule } from '@angular/material/badge';

import { TooltipModule } from 'primeng/tooltip';
@NgModule({
  declarations: [
    LayoutComponent,
    TopheaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    FlexLayoutModule,
    LayoutRoutingModule,
    TooltipModule,
    TranslateModule,
    BadgeModule,
    MatBadgeModule
  ],
  exports: [
    LayoutComponent,
    TopheaderComponent,
    TranslateModule
  ]
})

export class LayoutModule { }
