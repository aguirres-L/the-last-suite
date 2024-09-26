import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-btn-back',
  templateUrl: './btn-back.component.html',
  styleUrls: ['./btn-back.component.scss'],
})
export class BtnBackComponent  implements OnInit {

  constructor( private utilSvc: UtilsService ) { }

  ngOnInit() {}

  navigateHome() {
   setTimeout(()=>{ this.utilSvc.routerLink('/');},500)
  }

}
