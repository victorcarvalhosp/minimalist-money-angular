import { Injectable } from '@angular/core';
import {Observable} from "rxjs/index";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {IUser} from "../../models/credentials";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<any>('users');
    this.users = this.usersCollection.valueChanges();
  }

  createUser(authUid:string, user: IUser) {
    this.usersCollection.doc(authUid).set(user);
  }
}
