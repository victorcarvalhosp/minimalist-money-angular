import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "@angular/fire/auth";
import {switchMap} from "rxjs/internal/operators";
import {Observable} from "rxjs/index";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser: Observable<any>;

  constructor( public afAuth: AngularFireAuth, private router: Router) { }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  doSignOut(){
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): boolean{
    // this.afAuth.auth.onAuthStateChanged(user => {
    //   if(user){
    //     return true;
    //   }else{
    //     return f
    //   }
    // })
    Observable.create()
    console.log(this.afAuth.auth.currentUser != null);
    console.log(this.afAuth.auth.currentUser);
    return this.afAuth.auth.currentUser != null;
  }
}
