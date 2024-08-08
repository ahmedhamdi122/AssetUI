import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticateRoutingModule } from './authenticate-routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TooltipModule } from 'primeng/tooltip';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
  declarations: [LoginComponent, ResetPasswordComponent, ForgetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    AuthenticateRoutingModule,
    TranslateModule,
    TooltipModule,
    NgbModule,
    MatIconModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [LoginComponent],
})
export class AuthenticateModule { }
