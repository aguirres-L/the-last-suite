import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../service/firebase.service';
import { UtilsService } from '../service/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    let user = localStorage.getItem('user')
    
      return new Promise(( resolve )=>{
        this.firebaseSvc.getAuth().onAuthStateChanged((auth)=>{
          
          if (!auth){
           resolve(true);
          }else{
            this.utilsSvc.routerLink('/auth');
          /*   resolve(false); */
          resolve(false)
          }
     
        })
      })
    
    
    
  }
  
}
