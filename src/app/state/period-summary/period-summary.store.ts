import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {IPeriodSumary} from '../../models/period-summary';
import {PeriodSummaryService} from '../../services/period-summary/period-summary.service';
import {IPeriod} from '../../models/period';
import {SubSecondsPipe} from 'ngx-date-fns';
import {TransactionsStore} from "../transactions/transactions.store";
import {ITransaction} from "../../models/transaction";
import {TransactionTypeEnum} from "../../enums/transaction-type.enum";
import {PeriodStore} from "../period/period.store";

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
  public loading: boolean = true;

  constructor(private afs: AngularFirestore, private periodSummaryService: PeriodSummaryService,
              private transactionsStore: TransactionsStore, private  periodStore: PeriodStore) {
    this.calculateTotals();
  }

  calculateTotals() {
    this.loading = true;
    this.periodStore.period.subscribe( period => {
      const endDateLastMonth: Date = new SubSecondsPipe().transform(period.startDate, 1);
      this.periodSummaryService.getTotalRealized(endDateLastMonth).subscribe((res: any) => {
        this.transactionsStore.transactions.subscribe(transactions => {
          const periodSummary: IPeriodSumary = {previousBalance:  res.total,
            totalIncome: 0,
            expectedTotalIncome: 0,
            totalOutcome: 0,
            expectedTotalOutcome: 0,
            total: res.total,
            expectedTotal: res.total,
          };
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
          });
          this._periodSummary.next(periodSummary);
          this.loading = false;
        });
      });
    });
  }

  get periodSummary() {
    return this._periodSummary.asObservable();
  }

}
