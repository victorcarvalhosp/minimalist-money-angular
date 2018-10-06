import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {AngularFirestore} from '@angular/fire/firestore';
import {List} from 'immutable';
import {AccountTotalsService} from '../../services/account-totals/account-totals.service';
import {IAccountTotal} from '../../models/account-total';

@Injectable({
  providedIn: 'root'
})
export class AccountTotalsStore {

  private _accountTotal: BehaviorSubject<IAccountTotal> = new BehaviorSubject<IAccountTotal>({amount: 0,
    date: new Date()});
  private _accountTotalTotals: BehaviorSubject<List<IAccountTotal>> = new BehaviorSubject(List([]));

  constructor(private afs: AngularFirestore, private accountTotalsService: AccountTotalsService) {
  }

  private initializeData() {
    // this.accountTotalsService.getAllAccountTotals();
    // this.accountTotalsService.getAllAccountTotals().subscribe(res => {
    //   const accountTotalTotals: IAccountTotal[] = res.map(
    //     a => {
    //       const data = a.payload.doc.data() as IAccountTotal;
    //       data.id = a.payload.doc.id;
    //       return data;
    //     }
    //   );
    //   this._accountTotalTotals.next(List(accountTotalTotals));
    // });
  }

  get accountTotalTotals() {
    return this._accountTotalTotals.asObservable();
  }
}
