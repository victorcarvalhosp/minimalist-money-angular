import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {ITransaction} from '../../../models/transaction';
import {HomeService} from '../services/home.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateTransactionComponent} from './create-transaction/create-transaction.component';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {TransactionTypeEnum} from '../../../enums/transaction-type.enum';
import {TransactionsStore} from '../../../state/transactions/transactions.store';
import {PeriodSummaryStore} from '../../../state/period-summary/period-summary.store';
import {FileUploader} from 'ng2-file-upload';
import {AngularFireStorage} from '@angular/fire/storage';
import {Router} from '@angular/router';
import {TransactionsOfxStore} from '../../../state/transactions-ofx/transactions-ofx.store';
import {ImportOfxFileDetailsComponent} from "../reconciliation/import-ofx-file-details/import-ofx-file-details.component";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionsComponent implements OnInit {

  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);
  total: number;
  URL: any = 'https://evening-anchorage-3159.herokuapp.com/api/';
  public uploader: FileUploader = new FileUploader({url: this.URL});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(private breakpointObserver: BreakpointObserver, public homeService: HomeService,
              public transactionsStore: TransactionsStore,
              public dialog: MatDialog, public snackBar: MatSnackBar,
              public periodSummaryStore: PeriodSummaryStore,
              private storage: AngularFireStorage,
              private router: Router,
              public transactionsOfxStore: TransactionsOfxStore) {
    // this.transactionsStore.getTransactionsByDate();
    // this.periodSummaryStore.calculateTotals();

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public dropped(event: FileList) {
    const dialogRef = this.dialog.open(ImportOfxFileDetailsComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: event
    });
    const smallDialogSubscription = this.makeDialogResponsive(dialogRef);
    dialogRef.afterClosed().subscribe(result => {
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
    // this.transactionsOfxStore.importOfxFile(event);
    // this.router.navigate(['/home/reconciliation']);
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

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
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
    this.openDialog(newTransaction);
  }

  openDialog(transaction: ITransaction): void {
    const dialogRef = this.dialog.open(CreateTransactionComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: transaction
    });

    const smallDialogSubscription = this.isSmall.subscribe(size => {
        console.log(size);
        if (size.matches) {
          dialogRef.updateSize('100%', '100%');
        } else {
          dialogRef.updateSize('50%');
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
  }

  showDetails(transaction: ITransaction) {
    console.log('CLICK');
    // this.homeService.setShowBackButton(true);
    this.openDialog(transaction);
  }

  ngOnInit() {
  }

  toggleRealized(transaction: ITransaction) {
    console.log('toogle realized');
    transaction.realized = !transaction.realized;
    this.transactionsStore.save(transaction);
    this.openSnackBar(transaction.realized ? 'Transaction Realized' : 'Transaction Canceled');
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

}
