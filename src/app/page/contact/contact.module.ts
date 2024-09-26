import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactPage } from './contact.page';/* 
import { CardComponent } from 'src/app/component/card/card.component';
 */
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ContactPage, /* CardComponent */],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FormsModule,
    IonicModule.forRoot( {mode:"ios"} ),
    SharedModule
  ]
})
export class ContactModule { }
