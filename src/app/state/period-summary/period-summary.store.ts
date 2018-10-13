import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';
import {AngularFirestore} from '@angular/fire/firestore';
import {IPeriodSumary} from '../../models/period-summary';
import {PeriodSummaryService} from '../../services/period-summary/period-summary.service';
import {IPeriod} from '../../models/period';
import {SubSecondsPipe} from 'ngx-date-fns';
import {TransactionsStore} from "../transactions/transactions.store";
import {ITransaction} from "../../models/transaction";
import {TransactionTypeEnum} from "../../enums/transaction-type.enum";

@Injectable({
  providedIn: 'root'
})
export class PeriodSummaryStore {

  private _periodSummary: BehaviorSubject<IPeriodSumary> = new BehaviorSubject({previousBalance: 0,
  totalIncome: 0,
  expectedTotalIncome:  0,
  totalOutcome:  0,
  expectedTotalOutcome:  0,
  total:  0,
  expectedTotal:  0});

  constructor(private afs: AngularFirestore, private periodSummaryService: PeriodSummaryService,
              private transactionsStore: TransactionsStore) {
  }

  private initializeData() {
  }

  calculateTotals(period: IPeriod) {
    const endDateLastMonth: Date = new SubSecondsPipe().transform(period.startDate, 1);
    console.log(endDateLastMonth);
    this.periodSummaryService.getTotalRealized(endDateLastMonth).subscribe((res: any) => {
      const periodSummary: IPeriodSumary = {previousBalance:  res.total,
      totalIncome: 0,
      expectedTotalIncome: 0,
      totalOutcome: 0,
      expectedTotalOutcome: 0,
      total: res.total,
      expectedTotal: res.total,
      };
      this.transactionsStore.transactions.subscribe(transactions => {
        console.log(transactions);
        transactions.forEach((transaction: ITransaction) => {
          if (transaction.type === TransactionTypeEnum.OUTCOME) {
            periodSummary.expectedTotal -= transaction.amount;
            periodSummary.expectedTotalOutcome += transaction.amount;
            if (transaction.realized) {
              periodSummary.totalOutcome += transaction.amount;
              periodSummary.total -= transaction.amount;
            }
          } else if (transaction.type === TransactionTypeEnum.INCOME) {
            periodSummary.expectedTotal += transaction.amount;
            periodSummary.expectedTotalIncome += transaction.amount;
            if (transaction.realized) {
              periodSummary.totalIncome += transaction.amount;
              periodSummary.total += transaction.amount;
            }
          }
          console.log(transaction);
        });
        this._periodSummary.next(periodSummary);
      });
    });
  }

  get periodSummary() {
    return this._periodSummary.asObservable();
  }

}
