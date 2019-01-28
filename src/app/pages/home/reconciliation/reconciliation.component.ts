import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TransactionsOfxStore} from "../../../state/transactions-ofx/transactions-ofx.store";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {take} from "rxjs/operators";
import {ITransaction} from "../../../models/transaction";
import {TransactionsStore} from "../../../state/transactions/transactions.store";
import {ITransactionOfx} from "../../../models/transaction-ofx";
import {MatDialog, MatSnackBar} from "@angular/material";
import {CreateTransactionComponent} from "../transactions/create-transaction/create-transaction.component";
import {Observable} from "rxjs";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {OfxTransactionsRulesStore} from "../../../state/ofx-transactions-rules/ofx-transactions-rules.store";
import {TransactionTypeEnum} from "../../../enums/transaction-type.enum";
import {OfxTransactionsRulesComponent} from "./ofx-transactions-rules/ofx-transactions-rules.component";
import {ImportOfxFileDetailsComponent} from "./import-ofx-file-details/import-ofx-file-details.component";

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReconciliationComponent implements OnInit {
  transactionsOfxIds = [];
  selectedOfxTransactionId: string = '';
  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);

  constructor(private breakpointObserver: BreakpointObserver, public transactionsOfxStore: TransactionsOfxStore,
              public transactionsStore: TransactionsStore, public snackBar: MatSnackBar, public dialog: MatDialog, public ofxTransactionsRulesStore: OfxTransactionsRulesStore) {
  }


  drop(ofxTransaction: ITransactionOfx, event: CdkDragDrop<ITransaction[]>) {
    if (event.previousContainer === event.container) {
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      // console.log(event.container);
      // console.log(event.previousContainer.data);
      // console.log(event.previousIndex);
      // console.log(ofxTransaction);
      // console.log(event.previousContainer.data._tail.array[event.previousIndex]);
      //Added this if because [cdkDropListDisabled] was not working as expected
      if (!ofxTransaction.reconciled) {
        event.previousContainer.data.map((transaction: ITransaction, index: number) => {
          if (index === event.previousIndex) {
            this.transactionsOfxStore.addTransactionToReconciliation(ofxTransaction, transaction).pipe(take(1)).subscribe(t => {
                console.log(t);
              },
              err => {
                this.openSnackBar(err);
              });
          }
        });
      } else {
        this.openSnackBar('You can not add more transactions because bank transaction is already reconciled!');
      }
      // this.transactionsOfxStore.addTransactionToReconciliation(ofxTransaction, event.previousContainer.data._tail.array[event.previousIndex]);
      // copyArrayItem(event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex);
    }
  }


  changeStyles(ofxTransactionId: string) {
    if (ofxTransactionId) {
      this.selectedOfxTransactionId = ofxTransactionId;
      console.log(ofxTransactionId);
    }
  }

  confirmReconciliation(ofxTransaction: ITransactionOfx) {
    this.transactionsOfxStore.confirmReconciliation(ofxTransaction).pipe(take(1)).subscribe(t => {
        this.openSnackBar('Reconciled with success');
      },
      err => {
        this.openSnackBar(err);
      });
  }

  cancelReconciliation(ofxTransaction: ITransactionOfx) {
    this.transactionsOfxStore.cancelReconciliation(ofxTransaction).pipe(take(1)).subscribe(t => {
        this.openSnackBar('Canceled reconciliation with success');
      },
      err => {
        this.openSnackBar(err);
      });
  }

  removeTransactionFromOfxTransactions(ofxTransaction: ITransactionOfx, transaction: ITransaction) {
    this.transactionsOfxStore.removeTransactionFromOfxTransactions(ofxTransaction, transaction);
  }

  // drop($event: CdkDragDrop<{title: string, poster: string}[]>) {
  //   if ($event.previousContainer === $event.container) {
  //     moveItemInArray(
  //       $event.container.data,
  //       $event.previousIndex,
  //       $event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       $event.previousContainer.data,
  //       $event.container.data,
  //       $event.previousIndex,
  //       $event.currentIndex
  //     );
  //   }
  // }

  getTotalReconcilied(ofxTransaction: ITransactionOfx) {
    let total: number = 0;
    ofxTransaction.transactions.forEach(t => {
      total += t.amount;
    });
    return total;
  }

  ngOnInit() {
    this.transactionsOfxStore.transactions.subscribe(transactions => {
      console.log(transactions);
      this.transactionsOfxIds = [];
      transactions.forEach(transaction => {
        this.transactionsOfxIds.push(transaction.id);
      });
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

  editTransaction(transaction: ITransaction) {
    this.openTransactionDialog(transaction);
  }

  createNewTransactionWithOfxData(ofxTransaction: ITransactionOfx) {
    const transactionsAmount: number = ofxTransaction.amount - this.getTotalReconcilied(ofxTransaction);
    const transaction: ITransaction = {
      name: ofxTransaction.name,
      type: ofxTransaction.type,
      realized: true,
      amount: transactionsAmount,
      date: ofxTransaction.date,
      preReconciled: true,
      account: ofxTransaction.account,
      ofxTransactionId: ofxTransaction.id
    };
    this.ofxTransactionsRulesStore.applyRules(ofxTransaction, transaction);
    this.openTransactionDialog(transaction, ofxTransaction);
  }

  openOfxTransactionRulesDialog(): void {
    const dialogRef = this.dialog.open(OfxTransactionsRulesComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
    });
    const smallDialogSubscription = this.makeDialogResponsive(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      smallDialogSubscription.unsubscribe();
    });
  }

  openDialogImportOfx(): void {
  const dialogRef = this.dialog.open(ImportOfxFileDetailsComponent, {
    width: '50%',
    maxWidth: '100wh',
    maxHeight: '100vh',
    disableClose: true,
  });
  const smallDialogSubscription = this.makeDialogResponsive(dialogRef);
  dialogRef.afterClosed().subscribe(result => {
  smallDialogSubscription.unsubscribe();
});
}

  openDialogNewTransaction(type: TransactionTypeEnum): void {
    const newTransaction: ITransaction = {
      id: '',
      name: '',
      date: new Date(),
      amount: 0,
      type: type,
      realized: false
    };
    this.openTransactionDialog(newTransaction);
  }

  openTransactionDialog(transaction: ITransaction, ofxTransaction?: ITransactionOfx): void {
    const dialogRef = this.dialog.open(CreateTransactionComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: transaction
    });
    const smallDialogSubscription = this.makeDialogResponsive(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result.id) {
        if (ofxTransaction) {
          this.ofxTransactionsRulesStore.createNewRule(result, ofxTransaction);
        }
        this.transactionsOfxStore.addTransactionToOfxTransactions(result);
      }
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
  }

  private makeDialogResponsive(dialogRef) {
    return this.isSmall.subscribe(size => {
      console.log(size);
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('50%');
      }
    });
  }
}
