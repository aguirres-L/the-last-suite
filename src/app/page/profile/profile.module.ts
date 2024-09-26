import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { FormsModule } from '@angular/forms';
import { IonicModule, /* IonicRouteStrategy */ } from '@ionic/angular';
/* import { RouteReuseStrategy } from '@angular/router';
import { CardComponent } from 'src/app/component/card/card.component'; */
import { SharedModule } from 'src/app/shared/shared.module';
import { DeletComponent } from 'src/app/component/svg/delet/delet.component';
import { EditComponent } from 'src/app/component/svg/edit/edit.component';


@NgModule({
  declarations: [ProfilePage, DeletComponent, EditComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    IonicModule.forRoot( {mode:"ios"} ),
    SharedModule
  ],
/*   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }], */
})
export class ProfileModule { }
