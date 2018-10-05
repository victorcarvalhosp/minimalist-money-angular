import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {AngularFirestore} from '@angular/fire/firestore';
import {ITransaction} from '../../models/transaction';
import {TransactionsService} from '../../services/transactions/transactions.service';
import {List} from 'immutable';
import {IPeriod} from '../../models/period';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class TransactionsStore {

  private _transaction: BehaviorSubject<ITransaction> = new BehaviorSubject<ITransaction>(
    {name: '', type: TransactionTypeEnum.OUTCOME, realized: false, amount: 0, date: new Date() }
    );
  private _transactions: BehaviorSubject<List<ITransaction>> = new BehaviorSubject(List([]));

  constructor(private afs: AngularFirestore, private transactionsService: TransactionsService) {
    // this.initializeData();
    console.log('INITIALIZE TRANSACTIONS STORE');
  }

  public getTransactionsByDate(period: IPeriod) {
    console.log('FIND BY PERIOD');
    console.log(period);
    this.transactionsService.getTransactionsByDate(period).subscribe(res => {
      const transactions: ITransaction[] = res.map(
        a => {
          const data = a.payload.doc.data() as ITransaction;
          data.id = a.payload.doc.id;
          data.date = a.payload.doc.get('date').toDate();
          return data;
        }
      );
      console.log(transactions);
      this._transactions.next(List(transactions));
      this._transactions.subscribe(res => {
        console.log(res);
      });
    });
  }

  save(transaction: ITransaction): Observable<any> {
    return this.transactionsService.save(transaction);
  }

  delete(transaction: ITransaction): Observable<any> {
    return this.transactionsService.delete(transaction);
  }

  get transactions() {
    return this._transactions.asObservable();
  }
}
