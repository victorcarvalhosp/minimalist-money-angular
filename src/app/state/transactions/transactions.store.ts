import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {ITransaction} from '../../models/transaction';
import {TransactionsService} from '../../services/transactions/transactions.service';
import {List} from 'immutable';
import {IPeriod} from '../../models/period';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {PeriodStore} from '../period/period.store';
import {map, take} from 'rxjs/operators';
import {TransactionsOfxStore} from '../transactions-ofx/transactions-ofx.store';
import {AddMonthsPipe} from 'ngx-date-fns';

@Injectable({
  providedIn: 'root'
})
export class TransactionsStore {

  private _transaction: BehaviorSubject<ITransaction> = new BehaviorSubject<ITransaction>(
    {name: '', type: TransactionTypeEnum.OUTCOME, realized: false, amount: 0, date: new Date()}
  );
  private _transactions: BehaviorSubject<List<ITransaction>> = new BehaviorSubject(List([]));
  public loading = true;

  constructor(private afs: AngularFirestore,
              private transactionsService: TransactionsService,
              private periodStore: PeriodStore,
              private addMonths: AddMonthsPipe) {
    this.getTransactionsByDate();
  }

  public getTransactionsByDate() {
    this.periodStore.period.subscribe(period => {
      this.loading = true;
      this.transactionsService.getTransactionsByDate(period).subscribe(res => {
        const transactions: ITransaction[] = res.map(
          a => {
            const data = a.payload.doc.data() as ITransaction;
            data.id = a.payload.doc.id;
            data.date = a.payload.doc.get('date').toDate();
            return data;
          }
        );
        this._transactions.next(List(transactions));
        this.loading = false;
      });
    });
  }

  save(transaction: ITransaction): Observable<any> {
    if (transaction.repeat && !transaction.id) {
      const transactions: ITransaction[] = [];
      for (let i = 0; transaction.parcels > i; i++) {
        const newTransaction: ITransaction = {...transaction};
        newTransaction.date = this.addMonths.transform(transaction.date, i);
        if (i === 0 && transaction.realized) {
          transactions.push({...newTransaction, parcel: i + 1});
        } else {
          transactions.push({...newTransaction, parcel: i + 1, realized: false});
        }
      }
      return this.transactionsService.saveParcels(transactions);
    } else {
      return this.transactionsService.save(transaction).pipe(take(1));
    }
  }

  delete(transaction: ITransaction): Observable<any> {
    return this.transactionsService.delete(transaction);
  }

  get transactions() {
    return this._transactions.asObservable();
  }

  getTransaction(transactionUid: string): Observable<any> {
    return this.transactionsService.getTransaction(transactionUid);
  }

  // CREATE TRANSACTION AND RETURN OBSERVABLE HERE LATER
  updateConfirmReconciledTransactions(transactions: ITransaction[]) {
    this.updateReconciledValueTransactions(transactions, true);
  }

  // CREATE TRANSACTION AND RETURN OBSERVABLE HERE LATER
  updateCancelReconciledTransactions(transactions: ITransaction[]) {
    this.updateReconciledValueTransactions(transactions, false);
  }

  // CREATE TRANSACTION AND RETURN OBSERVABLE HERE LATER
  private updateReconciledValueTransactions(transactions: ITransaction[], valueReconciled: boolean) {
    transactions.forEach(t => {
      this.getTransaction(t.id).pipe(take(1)).subscribe((res: any) => {
        console.log(res.payload.data());
        const data = res.payload.data() as ITransaction;
        data.id = res.payload.id;
        data.reconciled = valueReconciled;
        data.preReconciled = true;
        return this.save(data).pipe(take(1));
      });
    });
  }
}
