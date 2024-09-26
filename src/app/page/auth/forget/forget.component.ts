import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss'],
})
export class ForgetComponent  implements OnInit {
  formEmail: FormGroup; 

  constructor( private firebaseSvc: FirebaseService, private utilsSvc :UtilsService, private formBuilder: FormBuilder  ) {
    this.formEmail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
      })
  }

  ngOnInit() {}
  
  
  async submit() {
    console.log( this.formEmail.value,'email');
    
    if(this.formEmail.valid){
  
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
      this.firebaseSvc.sendRecoveyEmail(this.formEmail.value.email).then( res => {
        console.log( res, 'res enviado email');
        
        this.utilsSvc.presentToast({
          message: ' Email Sent',
          duration:1500,
          color:'primary',
          position:'bottom',
          icon:'mail-outline'
        })
        
        this.utilsSvc.routerLink('/');
        /* this.formEmail.reset() */
        
      } ).catch( error =>{
        console.log(error,'Error');
        
        
        this.utilsSvc.presentToast({
          message: error.message,
          duration:2000,
          color:'primary',
          position:'bottom',
          icon:'alert-circle-otuline'
        })
        
      }).finally(()=>{
        loading.dismiss();
      }) // add finaly ? 
    }
  }

}
