import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  formLogin: FormGroup;

  constructor(
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder,
    private ServiceFirebase: FirebaseService
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}
  async onSubmit() {
    // Handle form 

    console.log('Form submitted');

    if (this.formLogin.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      const { email} = this.formLogin.value;
      
      console.log(email,'desde auth Page');
      
      this.ServiceFirebase.getUserByEmail(email)
      
       this.ServiceFirebase.signIn(this.formLogin.value )
        .then((res) => {
        
          this.utilsSvc.routerLink('/home')
        
          console.log(res, 'respues de login ');

        })
        .catch((error) => {
          console.log(error, 'error');

          this.utilsSvc.presentToast({
            message: 'Incorrect User ',
            duration: 2000,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }


}
