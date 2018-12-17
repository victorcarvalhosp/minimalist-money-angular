import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {
  Action,
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction, DocumentSnapshot
} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {IPeriod} from '../../models/period';
import {map, switchMap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import {ITransactionOfx} from '../../models/transaction-ofx';
import {TransactionsStore} from "../../state/transactions/transactions.store";


@Injectable({
  providedIn: 'root'
})
export class TransactionsOfxService {

  private transactionsCollection: AngularFirestoreCollection<ITransactionOfx>;
  private transactionsDoc: AngularFirestoreDocument<ITransactionOfx>;

  constructor(private afs: AngularFirestore, private authService: AuthService, private afAuth: AngularFireAuth) {
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
      this.transactionsCollection = this.afs.collection<any>(`users/${res.uid}/transactionsOfx`,
        ref => ref.where('date', '<=', period.endDate).where('date', '>=', period.startDate));
      return this.transactionsCollection.snapshotChanges();
    }));
  }

  getTransactionsByBankAccountIdAndBankTransactionId(bankTransactionId: string): Observable<DocumentChangeAction<any>[]> {
    return this.authService.getCurrentUserObservable().pipe(take(1), switchMap(res => {
      return this.afs.collection<any>(`users/${res.uid}/transactionsOfx`,
        ref => ref.where('bankTransactionId', '==', bankTransactionId)).snapshotChanges();
    }));
  }

  private getPath(user): string {
    return `users/${user.uid}/transactionsOfx`;
  }

  delete(transaction: ITransactionOfx): Observable<any> {
    if (transaction.id) {
      return from(this.transactionsCollection.doc(transaction.id).delete());
    }
  }

  getTransaction(transactionUid: string): Observable<Action<DocumentSnapshot<any>>> {
    return this.authService.getCurrentUserObservable().pipe(take(1), switchMap(res => {
      return this.afs.doc(`users/${res.uid}/transactionsOfx/${transactionUid}`).snapshotChanges();
    }));
  }

  save(transaction: ITransactionOfx): Observable<any> {
    if (transaction.id) {
      return from(this.transactionsCollection.doc(transaction.id).update(transaction));
    } else {
      const idBefore =  this.afs.createId();
      transaction.id = idBefore;
      return from(this.transactionsCollection.doc(idBefore).set(transaction));

      // return from(this.transactionsCollection.add(transaction).then());
    }
  }

}
