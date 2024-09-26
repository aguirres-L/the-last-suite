import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetRoutingModule } from './forget-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgetComponent } from './forget.component';
/*  */import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ForgetComponent],
  imports: [
    CommonModule,
    ForgetRoutingModule,
    ReactiveFormsModule,
    FormsModule ,
    SharedModule
  ]
})
export class ForgetModule { }
