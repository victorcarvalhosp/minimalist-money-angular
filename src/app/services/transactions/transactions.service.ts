import {Injectable} from '@angular/core';
import {ITransaction} from '../../models/transaction';
import {Observable} from 'rxjs/index';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {IPeriod} from '../../models/period';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {


  public transactions: Observable<ITransaction[]>;
  private transactionsCollection: AngularFirestoreCollection<ITransaction>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
  }

  private initializeData() {
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.transactionsCollection = this.afs.collection<any>(`transactions/${user.uid}/user_transactions`);
        this.transactions = this.transactionsCollection.valueChanges();
      }, err => {
        console.log(err);
      });
  }

  getTransactionsByDate(period: IPeriod) {
    // REFACTOR THIS CODE ASAP, is Duplicating initializeDate() just with the query... I am sure there's a better way to do that
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.uid);
        this.transactionsCollection = this.afs.collection<any>(`transactions/${user.uid}/user_transactions`,
          ref => ref.where('date', '<=', period.endDate).where('date', '>=', period.startDate));
        this.transactions = this.transactionsCollection.valueChanges();
      }, err => {
        console.log(err);
      });

  }

  addATransaction(account: ITransaction) {
    return this.transactionsCollection.add(account);
  }

  addDefaultTransactions() {
    return this.initializeData().then(res => {
      const promises: Promise<any>[] = [];
      const defaultTransactions: ITransaction[] = [
        {
          name: 'Movimento 1',
          type: TransactionTypeEnum.OUTCOME,
          realized: false,
          amount: 120,
          date: new Date()
        },
        {
          name: 'Movimento 2',
          type: TransactionTypeEnum.OUTCOME,
          realized: false,
          amount: 120,
          date: new Date(new Date().setMonth(8))
        },
        {
          name: 'Movimento 3',
          type: TransactionTypeEnum.OUTCOME,
          realized: false,
          amount: 120,
          date: new Date(new Date().setMonth(7))
        },
        {
          name: 'Movimento 4',
          type: TransactionTypeEnum.OUTCOME,
          realized: false,
          amount: 120,
          date: new Date(new Date().setMonth(6))
        },
      ];
      for (const c of defaultTransactions) {
        promises.push(this.addATransaction(c));
      }
      return promises;
    });
  }
}
