import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoaderComponent } from 'src/app/component/loader/loader.component';
import { SignupModule } from './signup/signup.module';
import { ForgetModule } from './forget/forget.module';



@NgModule({
  declarations: [AuthPage ,LoaderComponent ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SignupModule,
    ForgetModule
  ]
})
export class AuthModule { }
