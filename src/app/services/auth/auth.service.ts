import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "@angular/fire/auth";
import {switchMap} from "rxjs/internal/operators";
import {Observable, of} from 'rxjs';
import {Router} from "@angular/router";
import {IUser} from "../../models/credentials";
import {AngularFirestore} from "@angular/fire/firestore";
import {UserService} from "../user/user.service";
import {CategoriesService} from "../categories/categories.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser: Observable<IUser | null>;

  constructor(public afAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {
    this.loggedInUser = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log('return user');
          return this.afs.doc<IUser>(`users/${user.uid}`).valueChanges();
        } else {
          console.log('return null');
          return of(null);
        }
      })
    );
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doSignOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  isAuthenticated(): boolean {
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
