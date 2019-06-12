import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';

import { map } from "rxjs/operators";


// FIREBASE AUTH
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];

  public usuario: any = {};

  constructor( 
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth 
    ) {

      this.afAuth.authState.subscribe(
        user => {
          console.log('estado del usuario', user);
          if(!user){
            return;
          } else {
            this.usuario.nombre = user.displayName;
            this.usuario.uid = user.uid;
          }
        }
      );
     }


  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', 
    referencia => referencia.orderBy('fecha', 'desc')
                            .limit(5));
    return this.itemsCollection.valueChanges().pipe(
      map(
        (mensajes: Mensaje[]) => {
          this.chats = [];
          for (let mensaje of mensajes) {
            this.chats.unshift(mensaje);
          }
          return this.chats;



          // this.chats = mensajes;
          // console.log(this.chats);
        }
      )
      );
  }

  agregarMensaje( text: string ){
    // TODO: falta el uid del usuario
    let mensaje: Mensaje = {
      nombre: 'Isaias',
      mensaje: text,
      fecha: new Date().getTime()
    }
    return this.itemsCollection.add(mensaje);

  }



  login(proveedor: string) {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
