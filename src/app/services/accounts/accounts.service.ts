import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {ICategory} from '../../models/category';
import {IAccount} from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  public accounts: Observable<IAccount[]>;
  private accountsCollection: AngularFirestoreCollection<IAccount>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  private initializeData() {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.accountsCollection = this.afs.collection<any>(`users/${user.uid}/accounts`);
        this.accounts = this.accountsCollection.valueChanges();
      }, err => {
        console.log(err);
      });
  }

  addAccount(account: IAccount) {
    return this.accountsCollection.add(account);
  }

  addDefaultAccounts() {
    return this.initializeData().then(res => {
      const promises: Promise<any>[] = [];
      const defaultAccounts: IAccount[] = [
        {name: 'Money'},
        {name: 'Funds'},
      ];
      for (const c of defaultAccounts) {
        promises.push(this.addAccount(c));
      }
      return promises;
    });
  }
}
