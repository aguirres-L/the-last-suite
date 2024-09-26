import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { User } from '../models/user.model';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query, 
  updateDoc,
  deleteDoc,
  where,
  getDocs
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';


import { AngularFireStorage } from '@angular/fire/compat/storage';
import {  getStorage, uploadString, ref, getDownloadURL, deleteObject} from "firebase/storage"

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);
  
  coleccionName = 'users-the-last-suite'
  coleccionNameDate = 'date-booking'

  getAuth() {
    return getAuth();
  }

   

  signIn(user: User) {
/*     console.log(user,'desde service singIN'); */
    this.utilsSvc.sevenInLocalStorage('emailsUser', user.email) // add email in localstoarge
    this.utilsSvc.sevenInLocalStorage('user', user.email) // add email in localstoarge
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  
  async getUserByEmail( email: string) {
    const userQuery = query(
      collection(getFirestore(),this.coleccionName),
      where("email","==", email)
      )
      
      const querySnapshot = await getDocs(userQuery);
      
      if(!querySnapshot.empty){
        const userData = querySnapshot.docs[0].data;
        
        return { id: querySnapshot.docs[0].id, ...userData};
        
      }else{
        return null
      }
      
  }
 

  //=========  Crear usuario ======================

  signUp(user: User) {
  /*   console.log(user,'desde singUp service'); */
    
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // ====  Avutalizar usuario ============================================

  updateUser(displayName: string) {
    const currentUser = getAuth().currentUser;

    if (currentUser) {
      return updateProfile(currentUser, { displayName });
    } else {
      // Manejar el caso en el que currentUser es nulo
      return Promise.reject(new Error('No hay usuario autenticado'));
    }
  }

  //=========  Eviar email para restablcer contraseña  ======================

  sendRecoveyEmail(email: string | any) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //================ Cerrar sesion =============

  signOut() {
    getAuth().signOut(); // Haco que cierre sesion
    //localStorage.removeItem('user'); // elimino la info del localStorage de esta forma se sale por completo " Creo que elimina toda la info del localStorag" 
    this.utilsSvc.routerLink('/auth');
  }
  
  
  
  

  //========================================================= BASE DE DATOS  ======================

  // Add info user in DB 

  async coleccionUser(userData: { userName: string; email: string }) {
 /*    console.log(userData, 'form CollectionUser'); */

    try {
      // Referencia a la colección 'users'
      const userColectionRef = collection(getFirestore(), this.coleccionName);
      
      // Añadir un nuevo documento con los datos del usuario
      const docRef = await addDoc(userColectionRef, userData);
    /*   console.log('Documento agregado con ID: ', docRef.id); */
    } catch (error) {
      console.error('Error', error);
      throw error; 
    }
  }

  //====== Obtener documentos de una colleción 
  
  getCollecionData(path: string , collectionQuery?: any){
      const ref =  collection(getFirestore(),path)
      return collectionData(query( ref, collectionQuery), { idField:"id" } )
  }
  


  //=========  Crea un nuevo documento 
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data); // Esta funcion me permite guardar los datos del usuario y se implementaria en el archivo sign-up
  }



    //=========  Actualizar un nuevo documento o remplasa uno
    updateDocument(path: string, data: any) {
      return updateDoc(doc(getFirestore(), path), data); // Esta funcion me permite guardar los datos del usuario y se implementaria en el archivo sign-up
    }
  
  
  // ============ collectionBooking
  
    async collecionDateBooking( dateData: any ) {
      try {
          // Referencia a la colección 'date-booking'
      const dateBookingCollectionRef = collection(getFirestore(), this.coleccionName);

      // Añadir un nuevo documento con los datos de la fecha
      const docRef = await addDoc(dateBookingCollectionRef, dateData);
      
      } catch (error) {
        console.error('Error', error);
      throw error; 
    }
    }
  
  
  
  // ========= Eliminar Documento 
  
  async deleteDocument(docPath: string) {
    const db = getFirestore();
    const docRef = doc(db, docPath); // Crear referencia al documento
    await deleteDoc(docRef); // Eliminar el documento
  }
  

  // Obtener un documente ==============
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data(); //  --->  De esta forma puedo obtener los datos que estan firebase
  }

  // ========== Agregar un Documento =======
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data); // Esta funcion me permite guardar los datos del usuario y se implementaria en el archivo sign-up
  }
  
  
  
  // ==========================  Almacenamiento ========
  
  
  
  // ========== Subir imagen
  async uploadImge(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }
  

    
  // ========== Obtener ruta de la imagen con su url para poder modificar la img 
  
  async getFilePath(url:string){    // me devuelve la url de la img que esta en la base de datos 
    return ref(getStorage(),url).fullPath
  }
  
  
  
  // ==========  Eliminar archivos del storage 
  
  deletFile( path: string){
    return deleteObject(ref(getStorage(),path))
  }
  
  
}

