import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {ITransaction} from '../../models/transaction';
import {TransactionsService} from '../../services/transactions/transactions.service';
import {List} from 'immutable';
import {IPeriod} from '../../models/period';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {PeriodStore} from "../period/period.store";

@Injectable({
  providedIn: 'root'
})
export class TransactionsStore {

  private _transaction: BehaviorSubject<ITransaction> = new BehaviorSubject<ITransaction>(
    {name: '', type: TransactionTypeEnum.OUTCOME, realized: false, amount: 0, date: new Date() }
    );
  private _transactions: BehaviorSubject<List<ITransaction>> = new BehaviorSubject(List([]));
  public loading: boolean = true;

  constructor(private afs: AngularFirestore, private transactionsService: TransactionsService, private periodStore: PeriodStore) {
    // this.initializeData();
    this.getTransactionsByDate();
  }

  public getTransactionsByDate() {
   this.periodStore.period.subscribe( period => {
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
       console.log(transactions);
       this._transactions.next(List(transactions));
       this.loading = false;
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
