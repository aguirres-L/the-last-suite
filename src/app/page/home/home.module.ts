import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HomePage } from './home.page';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    HomeRoutingModule,
     IonicModule.forRoot( {mode:"ios"} ),
     FormsModule,

  ],
/*   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }], */
  
})
export class HomeModule { }
