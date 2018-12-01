import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionsService} from '../../../services/transactions/transactions.service';
import {ITransaction} from '../../../models/transaction';
import {CategoriesService} from '../../../services/categories/categories.service';
import {ICategory} from '../../../models/category';
import {HomeService} from '../services/home.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateTransactionComponent} from './create-transaction/create-transaction.component';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {TransactionTypeEnum} from '../../../enums/transaction-type.enum';
import {AccountsService} from '../../../services/accounts/accounts.service';
import {IPeriod} from '../../../models/period';
import {TransactionsStore} from '../../../state/transactions/transactions.store';
import {AccountTotalsStore} from '../../../state/account-totals/account-totals.store';
import {SubSecondsPipe} from 'ngx-date-fns';
import {PeriodSummaryStore} from '../../../state/period-summary/period-summary.store';
import {map, switchMap, finalize} from 'rxjs/operators';
import {FileUploader, } from 'ng2-file-upload';
import {AngularFireStorage} from '@angular/fire/storage';
import {parse as parseOFX} from 'ofx-js';
import {Router} from "@angular/router";
import {TransactionsOfxStore} from "../../../state/transactions-ofx/transactions-ofx.store";




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
              public dialog: MatDialog, public snackBar: MatSnackBar, public periodSummaryStore: PeriodSummaryStore, private storage: AngularFireStorage, private router: Router,
              public transactionsOfxStore: TransactionsOfxStore) {
    // this.transactionsStore.getTransactionsByDate();
    // this.periodSummaryStore.calculateTotals();

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public dropped(event: FileList) {
    this.transactionsOfxStore.importOfxFile(event);
    this.router.navigate(['/home/reconciliation']);
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
