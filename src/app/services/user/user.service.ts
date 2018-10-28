import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {IUser} from '../../models/credentials';
import {CategoriesService} from '../categories/categories.service';
import {AccountsService} from '../accounts/accounts.service';
import {TransactionsService} from "../transactions/transactions.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private categoriesService: CategoriesService, private accountsService: AccountsService, private transactionsService: TransactionsService) {
    this.usersCollection = afs.collection<any>('users');
    this.users = this.usersCollection.valueChanges();
  }

  createUser(user: IUser) {
    return this.usersCollection.doc(user.uid).set(user).then(res => {
      const promises: Promise<any>[] = [];
      promises.push(this.categoriesService.addDefaultCategories());
      promises.push(this.accountsService.addDefaultAccounts());
      return Promise.all(promises);
    }, err => {
      console.log(err);
    });
  }
}
