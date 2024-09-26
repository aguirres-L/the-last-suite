import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SignupComponent, ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule, // Este módulo es necesario para usar formGroup
    FormsModule ,
    SharedModule
  ]
})
export class SignupModule { }
