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
import {SubSecondsPipe} from "ngx-date-fns";
import {PeriodSummaryStore} from "../../../state/period-summary/period-summary.store";
import {map, switchMap, finalize} from "rxjs/operators";
import {FileUploader, } from "ng2-file-upload";
import {AngularFireStorage} from "@angular/fire/storage";


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


  constructor(private breakpointObserver: BreakpointObserver, public homeService: HomeService,
              public transactionsStore: TransactionsStore,
              public dialog: MatDialog, public snackBar: MatSnackBar, public periodSummaryStore: PeriodSummaryStore, private storage: AngularFireStorage) {
    // this.transactionsStore.getTransactionsByDate();
    // this.periodSummaryStore.calculateTotals();

  }

  public uploader:FileUploader = new FileUploader({url: this.URL});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public dropped(event: FileList) {
    console.log(event);
    const file = event[0];
    const filePath = 'name-your-file-path-here';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL() )
    )
      .subscribe();

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    fileReader.readAsText(file);
  }

  public fileOverAnother(e:any):void {
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
