import {Injectable} from '@angular/core';
import {BehaviorSubject, from, observable, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {List} from 'immutable';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {PeriodStore} from '../period/period.store';
import {ITransactionOfx} from '../../models/transaction-ofx';
import {parse as parseOFX} from 'ofx-js';
import {TransactionsOfxService} from "../../services/transactions-ofx/transactions-ofx.service";
import {ITransactionOfxOriginal} from "../../models/transaction-ofx-original";
import {ITransaction} from "../../models/transaction";
import {TransactionsStore} from "../transactions/transactions.store";
import {map, switchMap, take} from "rxjs/operators";
import { throwError } from 'rxjs';
import {ICategory} from "../../models/category";
import {IImportOfx} from "../../models/import-ofx";
import {IAccount} from "../../models/account";


@Injectable({
  providedIn: 'root'
})
export class TransactionsOfxStore {

  private _transaction: BehaviorSubject<ITransactionOfx> = new BehaviorSubject<ITransactionOfx>(
    {name: '', type: TransactionTypeEnum.OUTCOME, date: new Date(), amount: 0, transactions: [], account: null}
  );
  private _transactions: BehaviorSubject<List<ITransactionOfx>> = new BehaviorSubject(List([]));
  public loading: boolean = true;
  public loadingOfx: boolean = false;


  constructor(private afs: AngularFirestore, private transactionsOfxService: TransactionsOfxService, private periodStore: PeriodStore, private transactionsStore: TransactionsStore) {
    // this.initializeData();
    this.getTransactionsByDate();
  }

  public importOfxFile(importOfx: IImportOfx) {
    this.loadingOfx = true;
    for (const file of importOfx.files) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.readAndSaveOfxFile(fileReader, importOfx.account);
      };
      fileReader.readAsText(file._file);
    }
  }

  private readAndSaveOfxFile(fileReader, account: IAccount) {
    let ofxString: string = '';
    ofxString = fileReader.result + ' ';
    console.log(ofxString);
    parseOFX(ofxString).then(ofxData => {
      this.loadingOfx = true;
      console.log(ofxData);
      let transactionStatement;
      let accountId;
      if (ofxData.OFX.BANKMSGSRSV1) {
        const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
        accountId = statementResponse.BANKACCTFROM.ACCTID;
        const currencyCode = statementResponse.CURDEF;
        transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
      } else if (ofxData.OFX.CREDITCARDMSGSRSV1) {
        const statementResponse = ofxData.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS;
        accountId = statementResponse.CCACCTFROM.ACCTID;
        const currencyCode = statementResponse.CURDEF;
        transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
      }
      if (transactionStatement) {
        transactionStatement.forEach((ofxTransactionOriginal: ITransactionOfxOriginal) => {
          const bankTransactionId: string = accountId + ofxTransactionOriginal.FITID;
          this.transactionsOfxService.getTransactionsByBankAccountIdAndBankTransactionId(bankTransactionId).subscribe(res => {
            if (res.length === 0) {
              let transactionType: TransactionTypeEnum;
              if (ofxTransactionOriginal.TRNTYPE === 'CREDIT') {
                transactionType = TransactionTypeEnum.INCOME;
              } else {
                transactionType = TransactionTypeEnum.OUTCOME;
              }
              const amountAlwaysPositive = ofxTransactionOriginal.TRNAMT < 0 ? (ofxTransactionOriginal.TRNAMT * -1) : ofxTransactionOriginal.TRNAMT;
              const formatedDate: string = ofxTransactionOriginal.DTPOSTED.substr(0, 4) + '-' + ofxTransactionOriginal.DTPOSTED.substr(4, 2) + '-' + ofxTransactionOriginal.DTPOSTED.substr(6, 2);
              const ofxT: ITransactionOfx = {
                name: ofxTransactionOriginal.MEMO,
                type: transactionType,
                date: new Date(formatedDate),
                amount: amountAlwaysPositive,
                account: account,
                bankTransactionId: bankTransactionId,
                transactions: []
              };
              this.transactionsOfxService.save(ofxT);
            }
          });
        });
      }
      this.loadingOfx = false;

    });
  }

  public getTransactionsByDate() {
    this.periodStore.period.subscribe(period => {
      this.loading = true;
      this.transactionsOfxService.getTransactionsByDate(period).subscribe(res => {
        const transactions: ITransactionOfx[] = res.map(
          a => {
            const data = a.payload.doc.data() as ITransactionOfx;
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

  save(transaction: ITransactionOfx): Observable<any> {
    return this.transactionsOfxService.save(transaction);
  }

  delete(transaction: ITransactionOfx): Observable<any> {
    return this.transactionsOfxService.delete(transaction);
  }

  get transactions() {
    return this._transactions.asObservable();
  }

  addTransactionToReconciliation(ofxTransaction: ITransactionOfx, transaction: ITransaction): Observable<any> {
    if (!ofxTransaction.transactions) {
      ofxTransaction.transactions = [];
    }
    if (ofxTransaction.type === transaction.type) {
      transaction.preReconciled = true;
      ofxTransaction.transactions.push(transaction);
      // I think I can do this without using from and toPromise... study that later
      return from(this.save(ofxTransaction).toPromise().then(() => {
        transaction.ofxTransactionId = ofxTransaction.id;
        console.log('salvou');
        return this.transactionsStore.save(transaction).pipe(take(1));
      }));
    } else {
      return throwError('Não é do mesmo tipo');
    }
  }

  removeTransactionFromOfxTransactions(ofxTransaction: ITransactionOfx, transaction: ITransaction): Observable<any> {
    const index = ofxTransaction.transactions.indexOf(transaction);
    if (index > -1) {
      ofxTransaction.transactions.splice(index, 1);
    }
    return from(this.save(ofxTransaction).toPromise().then(() => {
      transaction.ofxTransactionId = null;
      transaction.preReconciled = false;
      transaction.reconciled = false;
      return this.transactionsStore.save(transaction).pipe(take(1));
    }));
  }

  getTransaction(transactionUid: string): Observable<any> {
    return this.transactionsOfxService.getTransaction(transactionUid);
  }

  //CREATE TRANSACTION AND RETURN OBSERVABLE HERE LATER
  addTransactionToOfxTransactions(transaction: ITransaction) {
    this.getTransaction(transaction.ofxTransactionId).pipe(take(1)).subscribe((res: any) => {
      const data = res.payload.data() as ITransactionOfx;
      data.id = res.payload.id;
      const index = data.transactions.indexOf(transaction);
      if (index < 0) {
        data.transactions.push(transaction);
      }
      return this.save(data).pipe(take(1));
    });
  }

  confirmReconciliation(ofxTransaction: ITransactionOfx) {
    // I think I can do this without using from and toPromise... study that later
    ofxTransaction.reconciled = true;
    return from(this.save(ofxTransaction).toPromise().then(() => {
      return this.transactionsStore.updateConfirmReconciledTransactions(ofxTransaction.transactions);
    }));
  }

  cancelReconciliation(ofxTransaction: ITransactionOfx) {
    // I think I can do this without using from and toPromise... study that later
    ofxTransaction.reconciled = false;
    return from(this.save(ofxTransaction).toPromise().then(() => {
      return this.transactionsStore.updateCancelReconciledTransactions(ofxTransaction.transactions);
    }));
  }
}
