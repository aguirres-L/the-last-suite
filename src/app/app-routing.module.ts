import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
/*   {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  }, */
  {
    path:'auth',
    loadChildren: () => import( './page/auth/auth.module').then( m => m.AuthModule) , 
  },
  
  {
    path:'home',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomeModule ), canActivate :[AuthGuard]
  },
  {
    path:'profile',
    loadChildren: () => import('./page/profile/profile.module').then( m => m.ProfileModule ) ,canActivate :[AuthGuard]
  },
  {
    path:'contact',
    loadChildren: () => import( './page/contact/contact.module').then( m => m.ContactModule) , canActivate :[AuthGuard]
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
