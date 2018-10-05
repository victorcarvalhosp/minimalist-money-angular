import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {IAccount} from '../../models/account';
import {map} from 'rxjs/operators';
import {IUser} from '../../models/credentials';

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

  public initializeData() {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('populate accounts');
        this.accountsCollection = this.afs.collection<any>(`users/${user.uid}/accounts`);
        this.accounts$ = this.getAccountsWithIds();
      }, err => {
        console.log(err);
      });
  }

  private getAccountsWithIds(): Observable<IAccount[]> {
    return this.accountsCollection.snapshotChanges().pipe(map(
      changes => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as IAccount;
            data.id = a.payload.doc.id;
            return data;
          }
        );
      })
    );
  }

  addAccount(account: IAccount) {
    return this.accountsCollection.add(account);
  }

  delete(account: IAccount) {
    if (account.id) {
      return this.accountsCollection.doc(account.id).delete();
    }
  }

  getAccounts(): Promise<IAccount[]> {
    return new Promise((resolve, reject) => {
      return this.authService.getCurrentUser()
        .then(user => {
          this.populateAccounts(user);
          this.accounts$.subscribe(value => {
            resolve(value);
          });
        }, err => {
          console.log(err);
        });
    });
  }


  private populateAccounts(user: IUser) {
    this.accountsCollection = this.afs.collection<any>(`users/${user.uid}/accounts`);
    this.accounts$ = this.getAccountsWithIds();
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
          totals: []
        }
      ];
      for (const c of defaultAccounts) {
        promises.push(this.addAccount(c));
      }
      return promises;
    });
  }
}
