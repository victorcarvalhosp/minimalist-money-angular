import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {List} from 'immutable';
import {AccountTotalsService} from '../../services/account-totals/account-totals.service';
import {IAccountTotal} from '../../models/account-total';
import {IAccountsSumary} from "../../models/accounts-summary";
import {PeriodStore} from "../period/period.store";

@Injectable({
  providedIn: 'root'
})
export class AccountTotalsStore {

  private _accountTotal: BehaviorSubject<IAccountTotal> = new BehaviorSubject<IAccountTotal>({accountId: null, totalIncome: 0, totalOutcome: 0, total: 0,
    date: new Date()});
  private _accountTotalTotals: BehaviorSubject<List<IAccountTotal>> = new BehaviorSubject(List([]));
  private _accountsSummary: BehaviorSubject<IAccountsSumary> = new BehaviorSubject({totalIncome: 0, totalOutcome: 0, total: 0, accountsTotals: []});

  constructor(private afs: AngularFirestore, private accountTotalsService: AccountTotalsService,
              private  periodStore: PeriodStore) {
    this.initializeData();
  }

  private initializeData() {
    this.periodStore.period.subscribe( period => {
      this.getTotals(period.endDate);
    });
  }

  getTotals(date: Date) {
    this.accountTotalsService.getTotals(date).subscribe((res: IAccountsSumary) => {
      console.log(res);
      this._accountsSummary.next(res);
    });
  }

  get accountsSummary() {
    return this._accountsSummary.asObservable();
  }

  get accountTotalTotals() {
    return this._accountTotalTotals.asObservable();
  }
}
