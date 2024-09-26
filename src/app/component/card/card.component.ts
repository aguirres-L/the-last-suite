import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {
  @Input() isUser: boolean = false
  @Input() user:{ name: string, email:string , phone:string} = {name:'', email:'', phone:''}

  constructor() { }

  ngOnInit() {}

}
