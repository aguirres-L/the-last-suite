import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPage } from './auth.page';
import { SignupComponent } from './signup/signup.component';
import { ForgetComponent } from './forget/forget.component';

const routes: Routes = [
  {
    path: '', // Aquí especificamos la ruta vacía para cargar AuthPage en /auth
    component: AuthPage
  },
  {
    path:'singup',
    component: SignupComponent
  },
  {
    path:'forget-password',
    component: ForgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
