import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
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

  createUser(user: IUser) {
    return this.usersCollection.doc(user.uid).set(user);
  }
}
