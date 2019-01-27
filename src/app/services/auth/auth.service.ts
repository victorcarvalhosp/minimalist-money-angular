import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap, take} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {IUser} from '../../models/credentials';
import {AngularFirestore} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private router: Router, private afs: AngularFirestore) {
  }

  public getLoggedInUser(): Observable<IUser> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          if (user.uid) {
            return this.afs.doc<IUser>(`users/${user.uid}`).valueChanges();
          }
        } else {
          console.log('return null');
          return of(null);
        }
      })
    );
  }

  doRecoverPassword(email: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  doLogin(value) {
    return this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password);
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
      localStorage.removeItem('uid');
      this.router.navigate(['/login']);
    });
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.auth.onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  getCurrentUserObservable(): Observable<IUser> {
    return this.afAuth.authState.pipe(take(1),
      switchMap(user => {
        if (user) {
          return this.afs.collection<IUser>(`users`).doc(`${user.uid}`).valueChanges();
        } else {
          console.log('return null');
          return of(null);
        }
      })
    );
  }

}
