import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, Query} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {AccountsService} from '../accounts/accounts.service';
import {IAccountTotal} from '../../models/account-total';
import {ITransaction} from '../../models/transaction';
import OrderByDirection = firebase.firestore.OrderByDirection;
import {Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {IAccount} from '../../models/account';
import {IPeriod} from '../../models/period';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountTotalsService {

  private totalsCollection: AngularFirestoreCollection<IAccountTotal>;

  constructor(private afs: AngularFirestore, private authService: AuthService, private http: HttpClient) { }

  getTotals(date: Date) {
    console.log('account totals service');
    return this.authService.getCurrentUserObservable().pipe(take(1), switchMap(res => {
      const headersWithUser = new HttpHeaders({'user': res.uid});
      return this.http.get(`https://us-central1-minimalist-money.cloudfunctions.net/getAccountsSummary?date=${date}`,
        {headers: headersWithUser});
    }));
  }

  // getTotalsByDate(date: Date): Observable<DocumentChangeAction<any>[]> {
  //   return this.authService.getCurrentUserObservable().pipe(switchMap(res => {
  //     this.totalsCollection = this.afs.collection<any>(`users/${res.uid}/transactions`,
  //       ref => ref.where('date', '<=', period.endDate).where('date', '>=', period.startDate));
  //     return this.totalsCollection.snapshotChanges();
  //   }));
  // }

  // private getPath(user): string {
  //   return `users/${user.uid}/transactions`;
  // }

  private populateTotals(accounts, user, date: Date) {
    accounts.forEach(account => {
      this.totalsCollection = this.afs.collection<any>(`users/${user.uid}/accounts/${account.id}/totals`,
        ref => ref.orderBy('date', 'desc').where('date', '<=', date).limit(1));
    });
  }

  // private getTotalsWithAccountName(account: IAccount): Observable<IAccountTotal[]> {
  //   return this.totalsCollection.snapshotChanges().pipe(map(
  //     changes => {
  //       return changes.map(
  //         a => {
  //           const data = a.payload.doc.data() as IAccountTotal;
  //           data.date = a.payload.doc.get('date').toDate();
  //           data.accountName = account.name;
  //           return data;
  //         }
  //       );
  //     })
  //   );
  // }
}
