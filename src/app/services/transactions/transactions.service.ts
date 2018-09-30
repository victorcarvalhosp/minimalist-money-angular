import {Injectable} from '@angular/core';
import {ITransaction} from '../../models/transaction';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {IPeriod} from '../../models/period';
import {map} from 'rxjs/operators';


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
        this.transactionsCollection = this.afs.collection<any>(`users/${user.uid}/transactions`);
        this.transactions = this.transactionsCollection.valueChanges();
      }, err => {
        console.log(err);
      });
  }

  getTransactionsByDate(period: IPeriod) {
    // REFACTOR THIS CODE ASAP, is Duplicating initializeDate() just with the query... I am sure there's a better way to do that
    return this.authService.getCurrentUser()
      .then(user => {
        console.log('UID' + user.id);
        console.log(period.endDate);
        this.transactionsCollection = this.afs.collection<any>(`users/${user.uid}/transactions`,
          ref => ref.where('date', '<=', period.endDate).where('date', '>=', period.startDate));
        this.transactions = this.transactionsCollection.snapshotChanges().pipe(map(
          changes => {
            return changes.map(
              a => {
                const data = a.payload.doc.data() as ITransaction;
                data.id = a.payload.doc.id;
                data.date = a.payload.doc.get('date').toDate();
                return data;
              }
            );
          }
          )
        );
      }, err => {
        console.log(err);
      });

  }

  addTransaction(transaction) {
    this.transactionsCollection.add(transaction);
  }

  save(transaction: ITransaction) {
    if (transaction.id) {
      console.log('UPDATE');
      return this.transactionsCollection.doc(transaction.id).update(transaction);
    } else {
      console.log('INSERT');
      return this.transactionsCollection.add(transaction);
    }
  }

  deleteTransaction(transaction: ITransaction) {
    if (transaction.id) {
      return this.transactionsCollection.doc(transaction.id).delete();
    }
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
        promises.push(this.save(c));
      }
      return promises;
    });
  }
}
