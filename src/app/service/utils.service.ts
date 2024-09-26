import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

/* import { Camera , CameraResultType, CameraSource  } from '@capacitor/camera'; */

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

   loadingCtrl = inject(LoadingController);
   toastCtrl = inject(ToastController)
   modalCtrl = inject(ModalController)
   alertCtrl = inject(AlertController); 
   router = inject(Router)
  
  
  
  
  /* 
  async takePicture(promptLabelHeader : string){
    return await Camera.getPhoto({
      quality: 98,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,  // DataUtl me permite guardar la img en firebase 
      source: CameraSource.Prompt, // Me permite indicar de doinde se debe de obtener la img, Puede ser de la camara - galeria o de ambas con el uso de "Prompt"
      promptLabelHeader,     // titulo del prom 
      promptLabelPhoto:"Seleciona una imgane", //promptLabelPhoto sirve para idnicar que suba una foto 
      promptLabelPicture: "Toma una foto"  // promptLabelPicture me va a indicar que tome una foto
    })
  }
   */
  
  //// ============   ALERT 
  
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }
  
  
  
  
  
  // ==== Loading Spiner 
  
   loading(){
    return this.loadingCtrl.create({spinner:"crescent"})
  }
  
  
  // ====== Toast 
  
  async presentToast(opts?: ToastOptions  ){
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  
  
  // ========  Router Link  enruta a cualquier pagina disponible 
  
  routerLink( url:string){
    return this.router.navigateByUrl(url)
  }
  
  
  // ========  Guardar info en el localStorage 
  
  sevenInLocalStorage(key:string , value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }
  
  // =============== Obtener datos desde el local strorage 
  
    getFromLocalStorage(key: string){
      const item = localStorage.getItem(key);

      if (item !== null) {
        return JSON.parse(item);
      } else {
        throw new Error(`No se encontró el elemento con la clave ${key} en el almacenamiento local.`);
      }
    }
  
  
  
  
  // ===================  MODAL  ============
  
  
    async presentModal(opts: ModalOptions){ // FUNCION PARA ABRIR MODAL 
      const modal = await this.modalCtrl.create(opts)
      await modal.present();
      
      const { data } = await modal.onWillDismiss(); // Con esta linea de codigo puedo acceder a la informacion que se guerden en el modal 
      if( data) return data
    }
  
    dismissModal(data?:any){  // FUNCION PARA CERRAR EL MODAL - se coloca un "?" ta que data puede que no exista 
      return this.modalCtrl.dismiss(data);
    }
}
