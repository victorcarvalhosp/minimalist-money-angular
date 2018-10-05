import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, Query} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {AccountsService} from '../accounts/accounts.service';
import {IAccountAmountAggregation} from '../../models/account_amount_aggregation';
import {ITransaction} from '../../models/transaction';
import OrderByDirection = firebase.firestore.OrderByDirection;
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IAccount} from '../../models/account';

@Injectable({
  providedIn: 'root'
})
export class TotalsService {

  private totalsCollection: AngularFirestoreCollection<IAccountAmountAggregation>;
  public totals$: Observable<IAccountAmountAggregation[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService, private accountsService: AccountsService) { }

  getTotals(date: Date): Promise<IAccountAmountAggregation[]> {
    const totals: IAccountAmountAggregation[] = [];
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser().then(user => {
        this.accountsService.getAccounts().then(accounts => {
          this.populateTotals(accounts, user, date, totals);
          resolve(totals);
        });
      });
    });
  }


  private populateTotals(accounts, user, date: Date, totals: IAccountAmountAggregation[]) {
    accounts.forEach(account => {
      this.totalsCollection = this.afs.collection<any>(`users/${user.uid}/accounts/${account.id}/totals`,
        ref => ref.orderBy('date', 'desc').where('date', '<=', date).limit(1));
      this.totals$ = this.getTotalsWithAccountName(account);
      this.totals$.subscribe(val => {
        if (val && val[0]) {
          totals.push(val[0]);
        }
      });
    });
  }

  private getTotalsWithAccountName(account: IAccount): Observable<IAccountAmountAggregation[]> {
    return this.totalsCollection.snapshotChanges().pipe(map(
      changes => {
        return changes.map(
          a => {
            const data = a.payload.doc.data() as IAccountAmountAggregation;
            data.date = a.payload.doc.get('date').toDate();
            data.accountName = account.name;
            return data;
          }
        );
      })
    );
  }
}
