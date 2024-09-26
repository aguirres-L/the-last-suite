import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
}) 
export class ProfilePage implements OnInit {
  user = {
       id:'',
    name: '',
    email: '',
    phone: '',
    dates: [] as { startDate: string; endDate: string }[] 
  };
  
  desde!: string;
  hasta!: string;
  
  path = 'emailsUser'; 
  firebasePath = 'users-the-last-suite'; 
  
  dateFirebase = "date-booking"
  allDate: { fechaInit?: string; fechaFin?: string }[] = [];
  busyDays: number[] = [];

  reservations = [
    { service: 'Corte de Pelo', date: '20/10/2024', time: '10:00 AM' },
    { service: 'Manicura', date: '21/10/2024', time: '2:00 PM' }
  ];

  constructor(private utilsSVC: UtilsService, private firebaseSVC: FirebaseService) { }

  ngOnInit() {
    const emailUser = this.utilsSVC.getFromLocalStorage(this.path); // Obtener email desde localStorage
    if (emailUser) {
      this.getUserDataByEmail(emailUser);
      
    } else {
      console.log('No se encontró un email en el localStorage.');
    }
   
    
  }


  // Método para obtener los datos del usuario de Firebase según el email
  async getUserDataByEmail(emailUser: string) {
    try {
      const db = getFirestore(); // Instancia de Firestore
      const usersRef = collection(db, this.firebasePath); // Referencia a la colección de usuarios (no a un documento)
      const q = query(usersRef, where('email', '==', emailUser)); // Consulta donde el email sea igual al proporcionado
      const querySnapshot = await getDocs(q); // Ejecutar la consulta

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          this.user = {
            id: doc.id,
            name: userData['name'],
            email: userData['email'],
            phone: userData['phone'],
            dates: userData['dates'] ? userData['dates'] : [] // Asegúrate de que dates sea un array
          };
          /* console.log('Usuario encontrado:', this.user); */
          this.separateDates(this.user.dates[0]); 
          
        });
        
      } else {
        console.log('No se encontró un usuario con ese email.');
      }
    } catch (error) {
      console.error('Error al obtener datos de Firebase:', error);
    }
  }


  async editDates() {
    const newDesde = prompt('Ingresa Nueva fecha Desde', this.desde);
    const newHasta = prompt('Ingresa Nueva fecha Hasta', this.hasta);
  
    if (newDesde && newHasta) {
      // Actualizamos las fechas directamente en el objeto dentro del array de 'users-the-last-suite'
      const updatedDates = {
        startDate: newDesde,
        endDate: newHasta
      };
  
      this.desde = newDesde;
      this.hasta = newHasta;
  
      // Actualizar en Firebase (colección de usuarios: 'users-the-last-suite')
      if (this.user.id) { // Asegurarse de usar el 'id' del usuario
        const updatedUserData = {
          ...this.user,
          dates: [updatedDates] // Actualizamos el array con el nuevo objeto de fechas
        };
        
        try {
          // Actualizar la colección 'users-the-last-suite'
          await this.firebaseSVC.updateDocument(`${this.firebasePath}/${this.user.id}`, updatedUserData);
          console.log('Fechas actualizadas en la colección de usuarios:', updatedUserData);
  
          // Luego de actualizar la colección de usuarios, buscamos y editamos la fecha en 'date-booking'
        } catch (error) {
          console.error('Error al actualizar fechas en Firebase:', error);
        }
      }
    }
  }
  
  // Nueva función para actualizar la fecha en 'date-booking'
  

  
  
 // Añadir nuevo método para eliminar fechas
// Método para eliminar fechas
async removeDates() {
  if (this.user.dates.length > 0) {
    // Mostrar un alert para confirmar la eliminación
    const alertOptions = {
      header: 'Confirm Delete',
      message: '¿Are you sure you want to delete this date?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete Canceled');
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            // Guardamos la fecha que se eliminará
            const dateToRemove = this.user.dates[0];
            
            // Eliminar la primera fecha
            const updatedDates = this.user.dates.slice(1); // Ajusta según sea necesario
            this.user.dates = updatedDates;

            // Si quedan fechas, actualiza 'desde' y 'hasta'
            if (updatedDates.length > 0) {
              this.separateDates(updatedDates[0]); 
            } else {
              this.desde = '';
              this.hasta = '';
            }

            // Actualizar en Firebase (users-the-last-suite)
            if (this.user.id) {
              const updatedUserData = { ...this.user, dates: updatedDates }; // Actualizamos las fechas
              try {
                await this.firebaseSVC.updateDocument(`${this.firebasePath}/${this.user.id}`, updatedUserData);
                console.log('Fechas actualizadas en Firebase:', updatedUserData);
                
                // Llamar al método para eliminar la fecha en 'date-booking'
                this.removeDateFromBooking(dateToRemove);
                
                this.utilsSVC.presentToast({
                  message: 'Date Deleted',
                  duration: 2000,
                  color: 'primary',
                  position: 'bottom',
                  icon: 'trash-outline'
                });
                
              } catch (error) {
                console.error('Error al actualizar fechas en Firebase:', error);
              }
            }
          }
        }
      ]
    };

    await this.utilsSVC.presentAlert(alertOptions);
  } else {
    console.log('No hay fechas para eliminar.');
  }
}


// Método para eliminar una fecha de la colección date-booking
async removeDateFromBooking(dateToRemove: { startDate?: string; endDate?: string }) {
  if (this.user && dateToRemove) {
    try {
      const db = getFirestore();
      const dateBookingRef = collection(db, this.dateFirebase);
      
      // Buscar el documento que contiene las fechas del usuario
      const q = query(dateBookingRef, where('userId', '==', this.user.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          const bookingData = docSnap.data() as { dates: { fechaInit: string; fechaFin: string }[] };

          // Filtrar las fechas eliminadas
          const updatedDates = bookingData.dates.filter(date => 
            date.fechaInit !== dateToRemove.startDate || date.fechaFin !== dateToRemove.endDate
          );

          // Si no quedan fechas, elimina el documento
          if (updatedDates.length === 0) {
            await deleteDoc(doc(db, this.dateFirebase, docSnap.id));
            console.log('Documento eliminado ya que no quedan fechas.');
          } else {
            // Actualizar el documento con las fechas restantes
            await updateDoc(doc(db, this.dateFirebase, docSnap.id), { dates: updatedDates });
            console.log('Fechas actualizadas:', updatedDates);
          }

          /* alert('Fecha eliminada correctamente de date-booking!'); */
        });
      } else {
        console.log('No se encontró un registro de booking para este usuario.');
      }
    } catch (error) {
      console.error('Error al eliminar la fecha de date-booking:', error);
    }
  } else {
    alert('No se encontró el usuario o no hay fecha para eliminar.');
  }
}



 // Método para dividir las fechas 'Desde' y 'Hasta'
 separateDates(dates: any) {
  if (typeof dates === 'string') {
    // Si es una cadena, se procesa como antes
    const dateParts = dates.split(' - ');
    if (dateParts.length === 2) {
      this.desde = dateParts[0].replace('Desde: ', '').trim();
      this.hasta = dateParts[1].replace('Hasta: ', '').trim();
      console.log('Desde:', this.desde);
      console.log('Hasta:', this.hasta);
    } else {
      /* console.log('Formato de fechas incorrecto.'); */
    }
  } else if (typeof dates === 'object' && dates !== null) {
    // Si es un objeto, se asume que tiene las propiedades startDate y endDate
    const { startDate, endDate } = dates;
    if (startDate && endDate) {
      this.desde = startDate.trim();
      this.hasta = endDate.trim();
  
    } else {
     /*  console.log('El objeto debe tener las propiedades startDate y endDate.'); */
    }
  } else {
    console.log('El campo dates no es una cadena ni un objeto válido:', dates);
  }
}

  updateUser() {
    // Lógica para actualizar los datos del usuario
    console.log('Datos del usuario actualizados:', this.user);
  }
}
