import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage  implements OnInit {

  constructor() { }
  contacts = [
    { name: 'Recepción', role: 'Atención al Cliente', phone: '+54 11 1234-5678', email: 'recepcion@hotel.com' },
    { name: 'Mantenimiento', role: 'Soporte Técnico', phone: '+54 11 9876-5432', email: 'mantenimiento@hotel.com' },
    { name: 'Reservas', role: 'Gestión de Reservas', phone: '+54 11 5555-4444', email: 'reservas@hotel.com' }
  ];

  callContact(phone: string) {
    // Lógica para realizar una llamada
    console.log('Llamando a:', phone);
  }

  sendMessage(email: string) {
    // Lógica para enviar un mensaje
    console.log('Enviando mensaje a:', email);
  }
  ngOnInit() {}

}
