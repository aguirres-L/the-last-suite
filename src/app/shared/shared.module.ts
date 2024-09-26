// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../component/card/card.component';
import { BtnBackComponent } from '../component/btn-back/btn-back.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent,BtnBackComponent],
  exports: [CardComponent,BtnBackComponent] // Exporta CardComponent
})
export class SharedModule {}
