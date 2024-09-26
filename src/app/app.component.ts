import { Component, inject } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from './service/firebase.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Profile', url: '/profile', icon: 'person' },
    { title: 'Contact', url: '/contact', icon: 'call' },

  ];
  public labels = ['logout'];
  public isLoggingOut = false;
  
  showMenu: boolean = false;
  
  

  constructor(private router: Router, private alertController: AlertController, private firebaseSvc : FirebaseService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showMenu =
          this.router.url === '/home' ||
          this.router.url === '/profile' ||
          this.router.url === '/contact';
      }
    });
  }
  logout() {
    this.isLoggingOut = true;
    
    setTimeout(()=>{
      this.firebaseSvc.signOut() 
      this.router.navigate(['/auth']);
      this.isLoggingOut = false;
    },1000)
    }
  
  async presentLogoutConfirm() {
      
      setTimeout(async()=>{
        const alert = await this.alertController.create({
          header: 'Confirm Logout',
          message: ' Are you sure you want to logout? ',
          buttons:[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass:'secondary'
            },
            {
              text: 'Logut',
              handler: ()=>{
                this.logout()
              }
            }
          ]
        })
        await alert.present();
      },200)
  }
  
  
}

