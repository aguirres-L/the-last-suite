import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  selectdImag!:any;
  
  
  constructor(private utlisSvc: UtilsService,private formBuilder: FormBuilder, private ServiceFirebase : FirebaseService, /* private router :Router */) {
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      dates:''
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];  // corregido targer a target
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectdImag = e.target.result;  // corregido targer a target
        console.log('Imagen seleccionada:', this.selectdImag);
      };
      reader.readAsDataURL(file);  // Lee la imagen como Data URL para subirla
    }
  }
  

  async onSubmit() {
    if (this.signupForm.valid) {
      
      const loading = await this.utlisSvc.loading();
      await loading.present();
      
    
      await this.ServiceFirebase.signUp(this.signupForm.value as User ).then( res =>{
      
        this.ServiceFirebase.coleccionUser(this.signupForm.value ) 
        
      
        this.utlisSvc.presentToast({
          message:'User Created',
          duration: 2000,
          color:'primary',
          position:'bottom',
          icon:'person-outline'
        })
        
        this.utlisSvc.routerLink('/')
        
        
      }).catch( error =>{
        this.utlisSvc.presentToast({
          message: error.message,
          duration: 2000,
          color:'danger',
          position:'bottom',
          icon:'aler-ciclre-outile'
        })
      } ).finally(()=>{
        loading.dismiss()
      })
      
      
      
      console.log('Datos del formulario:', this.signupForm.value);
      
      
    } 
  }
}
