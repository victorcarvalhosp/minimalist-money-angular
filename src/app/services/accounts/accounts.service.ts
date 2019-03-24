import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {IAccount} from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private accountsCollection: AngularFirestoreCollection<IAccount>;
  private accountsDoc: AngularFirestoreDocument<IAccount>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.initializeData();
  }

  public initializeData() {
    return this.authService.getCurrentUser().then(user => {
      this.accountsCollection = this.afs.collection<any>(this.getPath(user),
        ref => ref.orderBy('name'));
    });
  }

  getAllAccounts(): Observable<DocumentChangeAction<any>[]> {
    return this.accountsCollection.snapshotChanges();
  }

  private getPath(user): string {
    return `users/${user.uid}/accounts`;
  }

  delete(account: IAccount): Observable<any> {
    if (account.id) {
      return from(this.accountsCollection.doc(account.id).delete());
    }
  }

  getAccount(accountUid: string) {
    // return this.authService.getCurrentUser()
    //   .then(user => {
    //     console.log('UID' + user.uid);
    //     this.accountsDoc = this.afs.doc(`users/${user.uid}/accounts/${accountUid}`);
    //     this.account = this.accountsDoc.valueChanges();
    //   }, err => {
    //     console.log(err);
    //   });


    // return fromPromise(this.authService.getCurrentUser()).pipe(switchMap(res => {
    //   console.log(res)
    //   return this.afs.doc<any>(`accounts$/${res.uid}/user_accounts/${accountUid}`).valueChanges();
    // }));
    // console.log('get account');
    //    this.afs.doc<any>(`JP1VKSxi3BX196Clk7eHr1rxmLn1/accounts$/${accountUid}`).snapshotChanges().pipe(map(res => {
    //
    //     console.log(res);
    //     return res.payload;
    //   })).subscribe(res => {
    //     console.log(res);
    //    });
  }

  save(account: IAccount): Observable<any> {
    if (account.id) {
      return from(this.accountsCollection.doc(account.id).update(account));
    } else {
      return from(this.accountsCollection.add(account));
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
        promises.push(this.save(c).toPromise());
      }
      return promises;
    });
  }
}
