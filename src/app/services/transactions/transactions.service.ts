import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {IPeriod} from '../../models/period';
import {map, switchMap} from 'rxjs/operators';
import {ITransaction} from '../../models/transaction';
import {AngularFireAuth} from '@angular/fire/auth';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private transactionsCollection: AngularFirestoreCollection<ITransaction>;
  private transactionsDoc: AngularFirestoreDocument<ITransaction>;

  constructor(private afs: AngularFirestore, private authService: AuthService, private afAuth: AngularFireAuth) {
    console.log('initialize transactions service');
  }

  private initializeData() {
    return this.authService.getCurrentUser().then(user => {
      // this.transactionsCollection = this.afs.collection<any>(this.getPath(user));
    });
  }

  getAllTransactions(): Observable<DocumentChangeAction<any>[]> {
    return this.transactionsCollection.snapshotChanges();
  }

  getTransactionsByDate(period: IPeriod): Observable<DocumentChangeAction<any>[]> {
    return this.authService.getCurrentUserObservable().pipe(take(1), switchMap(res => {
      this.transactionsCollection = this.afs.collection<any>(`users/${res.uid}/transactions`,
        ref => ref.where('date', '<=', period.endDate).where('date', '>=', period.startDate));
      return this.transactionsCollection.snapshotChanges();
    }));
  }

  private getPath(user): string {
    return `users/${user.uid}/transactions`;
  }

  delete(transaction: ITransaction): Observable<any> {
    if (transaction.id) {
      return from(this.transactionsCollection.doc(transaction.id).delete());
    }
  }

  getTransaction(transactionUid: string) {
    // return this.authService.getCurrentUser()
    //   .then(user => {
    //     console.log('UID' + user.uid);
    //     this.transactionsDoc = this.afs.doc(`users/${user.uid}/transactions/${transactionUid}`);
    //     this.transaction = this.transactionsDoc.valueChanges();
    //   }, err => {
    //     console.log(err);
    //   });


    // return fromPromise(this.authService.getCurrentUser()).pipe(switchMap(res => {
    //   console.log(res)
    //   return this.afs.doc<any>(`transactions$/${res.uid}/user_transactions/${transactionUid}`).valueChanges();
    // }));
    // console.log('get transaction');
    //    this.afs.doc<any>(`JP1VKSxi3BX196Clk7eHr1rxmLn1/transactions$/${transactionUid}`).snapshotChanges().pipe(map(res => {
    //
    //     console.log(res);
    //     return res.payload;
    //   })).subscribe(res => {
    //     console.log(res);
    //    });
  }

  save(transaction: ITransaction): Observable<any> {
    if (transaction.id) {
      return from(this.transactionsCollection.doc(transaction.id).update(transaction));
    } else {
      const idBefore =  this.afs.createId();
      transaction.id = idBefore;
      return from(this.transactionsCollection.doc(idBefore).set(transaction));

      // return from(this.transactionsCollection.add(transaction).then());
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
        promises.push(this.save(c).toPromise());
      }
      return promises;
    });
  }
}
