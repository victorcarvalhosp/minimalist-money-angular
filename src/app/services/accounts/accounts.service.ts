import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {IAccount} from '../../models/account';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  public account: Observable<IAccount>;

  public accounts$: Observable<IAccount[]>;
  private accountsCollection: AngularFirestoreCollection<IAccount>;
  private accountsDoc: AngularFirestoreDocument<IAccount>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  private initializeData() {
    return this.authService.getCurrentUser()
      .then(user => {
        this.accountsCollection = this.afs.collection<any>(`users/${user.uid}/accounts`);
        this.accounts$ = this.accountsCollection.snapshotChanges().pipe(map(
          changes => {
            return changes.map(
              a => {
                const data = a.payload.doc.data() as IAccount;
                data.id = a.payload.doc.id;
                return data;
              }
            );
          }
          )
        );
      }, err => {
        console.log(err);
      });
  }

  addAccount(account: IAccount) {
    return this.accountsCollection.add(account);
  }

  delete(account: IAccount) {
    if (account.id) {
      return this.accountsCollection.doc(account.id).delete();
    }
  }

  getAccount(accountUid: string) {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.accountsDoc = this.afs.doc(`users/${user.uid}/accounts/${accountUid}`);
        this.account = this.accountsDoc.valueChanges();
      }, err => {
        console.log(err);
      });
  }

  save(account: IAccount) {
    if (account.id) {
      return this.accountsCollection.doc(account.id).update(account);
    } else {
      return this.accountsCollection.add(account);
    }
  }

  addDefaultAccounts() {
    return this.initializeData().then(res => {
      const promises: Promise<any>[] = [];
      const defaultAccounts: IAccount[] = [
        {
          name: 'Money',
        }
      ];
      for (const c of defaultAccounts) {
        promises.push(this.addAccount(c));
      }
      return promises;
    });
  }
}
