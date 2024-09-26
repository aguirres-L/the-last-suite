import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, addDoc } from 'firebase/firestore';

interface DateRange {
  startDate?: string;
  endDate?: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  
  selectedDate: string | null = null; // Para la fecha seleccionada
  startDate: string | null = null; // Para la fecha de inicio
  endDate: string | null = null; // Para la fecha de fin
  
  // Array para almacenar las fechas
 // Define el array para manejar fechas individuales o rangos de fechas
dateArray: { date?: string; startDate?: string; endDate?: string }[] = [];


  // Limite de días seleccionables
  maxDays: number = 3;

  // dateSelec
  datesSelected: boolean = false;
  
  path:string="emailsUser" 
  firebasePath:string = "users-the-last-suite"
  dateFirebase = "date-booking"
  user: { id:string, name: string; email: string; phone: number; } | undefined;
  
  allDate: { fechaInit?: string; fechaFin?: string }[] = [];
  availableDays: string[] =[];
  busyDays: number[] = [];
  dateCalendar: { fechaInit?: string; fechaFin?: string }[] = [];
  
  constructor( private serviceSVC: FirebaseService, private utilsSVC : UtilsService ) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    
    const emailUser = this.utilsSVC.getFromLocalStorage(this.path);
    if(emailUser) {
      this.getUserDataByEmail(emailUser);
      this.getAllDatesFromBooking();
    }else{
      throw console.error('Error in data user')
    }
    
     this.dateCalendar = this.allDate
    

  }

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
            phone: userData['phone']
          };
       /*    console.log('Usuario encontrado:', this.user); */
        });
      } else {
        console.log('No se encontró un usuario con ese email.');
      }
    } catch (error) {
      console.error('Error al obtener datos de Firebase:', error);
    }
  }


  async getAllDatesFromBooking() {
    try {
      const db = getFirestore();
      const dateBookingRef = collection(db, this.dateFirebase);
      const querySnapshot = await getDocs(dateBookingRef);
    
      querySnapshot.forEach((doc) => {
        const bookingData = doc.data() as { dates: {id: string; fechaInit: string; fechaFin: string }[] };
        if (bookingData && bookingData.dates) {
          this.allDate.push(...bookingData.dates);
          
       
          
          bookingData.dates.forEach(date => {
            
          
            const start = new Date(date.fechaInit);
            const end = new Date(date.fechaFin);
            // Agregar días ocupados
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
              this.busyDays.push(d.getDate()+1); // Guardar solo el día
            }
          });
        }
      });
  
      this.busyDays = Array.from(new Set(this.busyDays)); // Eliminar duplicados
/*       console.log('Días ocupados:', this.busyDays); */
    } catch (error) {
      console.error('Error al obtener fechas de la colección date-booking:', error);
    }
  }
  
  
  // Método para extraer los días de `allDate`
  extractDaysFromAllDate(): number[] {
    const daysSet = new Set<number>();
  
    this.allDate.forEach(dateRange => {
      if (dateRange.fechaInit && dateRange.fechaFin) { // Usar las claves correctas
        const start = new Date(dateRange.fechaInit); // Usar las claves correctas
        const end = new Date(dateRange.fechaFin); // Usar las claves correctas
  
        // Añadir cada día dentro del rango al conjunto
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dayNumber = d.getDate()+1; // Obtener el número del día
        daysSet.add(dayNumber); // Añadir el día como número
        }
      }
    });
  
    // Convertir el Set a array y devolver
    return Array.from(daysSet);
  }
    
    
    
    // Función para resaltar las fechas
  
    highlightedDates = (isoString: string) => {
    
      
      const date = new Date(isoString);
      
      // Obtener la fecha más alta de fechaFin
      const maxFechaFin = this.getMaxFechaFin();
    
      const startHighlightDate = new Date(maxFechaFin);
      startHighlightDate.setDate(startHighlightDate.getDate() + 1); 
    
      const endHighlightDate = new Date(startHighlightDate);
      endHighlightDate.setDate(endHighlightDate.getDate() + 30); 
    
      // Comprobar si la fecha actual está dentro del rango de resaltado
      if (date >= startHighlightDate && date <= endHighlightDate) {
        return {
          backgroundColor: '#21ee31',
        };
      }
    
      return undefined; // Sin resaltar
    }
  
  
  // Método para obtener la fecha más alta de fechaFin
  getMaxFechaFin() {
    // Filtrar solo los elementos que tienen una fechaFin válida
    const validDates = this.dateCalendar.filter(item => item.fechaFin);
  
    // Reducir para encontrar la fecha más alta
    return validDates.reduce((maxDate, current) => {
      const currentDateFin = new Date(current.fechaFin!); // Usamos el operador de aserción no nula
      return currentDateFin > maxDate ? currentDateFin : maxDate;
    }, new Date(0)).toISOString(); // Inicializa con una fecha muy baja
  }
  
  

  
  
  setAvailableDays() {
    const currentMonth = new Date().getMonth(); // Mes actual

    for (const range of this.allDate) {
      const startDate = range.fechaInit ? new Date(range.fechaInit) : null;
      const endDate = range.fechaFin ? new Date(range.fechaFin) : null;

      if (startDate && endDate && startDate.getMonth() === currentMonth) {
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          this.busyDays.push(d.getDate());
        }
      }
    }
   }



  // Método para manejar la selección de la fecha
  onDateChange() {
    if (this.selectedDate) {
      this.dateArray.push({ date: this.selectedDate });
      /* console.log('Fecha seleccionada agregada al array:', this.dateArray); */
    }
  }

  // Método para manejar el rango de fechas
  onRangeChange() {
    if (this.startDate && this.endDate) {
      const rangeDays = this.calculateRangeDays(this.startDate, this.endDate);
      if (rangeDays <= this.maxDays) {
        // Guarda el rango de fechas como un objeto en lugar de una cadena
        this.dateArray.push({ startDate: this.startDate, endDate: this.endDate });
        this.datesSelected = true;
        console.log('Rango de fechas agregado al array:', this.dateArray);
      } else {
        alert(`Solo puedes seleccionar un máximo de ${this.maxDays} días.`);
      }
    }
  }

  removeDate(dateObj: { date?: string; startDate?: string; endDate?: string }) {
    // Filtrar el array según si es fecha única o rango
    this.dateArray = this.dateArray.filter(d =>
      d.date !== dateObj.date && d.startDate !== dateObj.startDate && d.endDate !== dateObj.endDate
    );
    
    if (this.dateArray.length === 0) {
      this.datesSelected = false; // Cambia la bandera a false si no hay fechas
    }
    console.log('Fecha eliminada:', dateObj);
  }
  
  // Calcular el número de días entre dos fechas
  private calculateRangeDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 para incluir ambos días
  }
  
  
  
  
  
  async saveDatesToBooking() {
    if (this.dateArray.length > 0) {
      try {
        const db = getFirestore();
        const dateBookingRef = collection(db, this.dateFirebase);
      
      
        const bookingData = {
          userId: this.user?.id,
          dates: this.dateArray.map(date => ({
            fechaInit: date.startDate,
            fechaFin: date.endDate,
          })), 
          createdAt: new Date(),
        
        };
  
        const docRef = await addDoc(dateBookingRef, bookingData);
    /*     console.log('Fechas guardadas en date-booking con ID:', docRef.id); */
        
     /*    alert('Fechas guardadas exitosamente en la colección date-booking!'); */
      } catch (error) {
        console.error('Error al guardar fechas en Firestore:', error);
      }
    } else {
      alert('No hay fechas seleccionadas para guardar.');
    }
  }
  
  
  
  
  async updateUserDates() {
    if (this.user && this.dateArray.length > 0) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, this.firebasePath, this.user.id); // Referencia al documento del usuario
        await updateDoc(userDocRef, {
          dates: this.dateArray // Aquí puedes establecer la propiedad (e.g., dates)
        });
       /*  console.log('Fechas actualizadas en Firestore:', this.dateArray); */
        
        this.saveDatesToBooking()
        
        this.utilsSVC.presentToast({
          message:'Saved Successfully',
          duration: 2000,
          color:'primary',
          position:'bottom',
          icon:'save-outline'
          
        })
        
      } catch (error) {
        console.error('Error al actualizar las fechas:', error);
          
        this.utilsSVC.presentToast({
          message:'Save Failed',
          duration: 2000,
          color:'danger',
          position:'bottom',
          icon:'alert-outline'
          
        })
      }
    } else {
      alert('No se encontró el usuario o no hay fechas para guardar.');
    }
  }

  // Método para guardar las fechas seleccionadas
  async saveDates() {
    if (this.dateArray.length > 0 && this.user) {
        await this.updateUserDates();
        this.datesSelected = false;
        this.dateArray = [];

        // Recarga los datos después de guardar
        this.getAllDatesFromBooking(); // Para actualizar la lista de fechas
        this.getUserDataByEmail(this.utilsSVC.getFromLocalStorage(this.path)); // Para actualizar los datos del usuario
    } else {
        this.utilsSVC.presentToast({
            message: 'There is no date to save',
            duration: 2000,
            color: 'primary',
            position: 'bottom',
            icon: 'alert-outline'
        });
    }
}

  }
