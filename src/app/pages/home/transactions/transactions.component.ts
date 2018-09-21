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

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionsComponent implements OnInit {

  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);

  category: Observable<ICategory>;
  transactions: Observable<ITransaction[]>;

  constructor(private breakpointObserver: BreakpointObserver, public homeService: HomeService,
              public transactionsService: TransactionsService, public categoriesService: CategoriesService,
              public dialog: MatDialog, public snackBar: MatSnackBar) {
    // this.category = this.getCategory('123')
    this.getCategory('123');
  }

  openDialogIncome() {
    this.openDialogNewTransaction(TransactionTypeEnum.INCOME);
  }

  openDialogOutcome() {
    this.openDialogNewTransaction(TransactionTypeEnum.OUTCOME);
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
      })
    ;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
  }

  handlePeriodLoaded(period) {
    console.log('period loaded');
    this.transactionsService.getTransactionsByDate(period);
    this.transactions = this.transactionsService.transactions;
  }

  getCategory(categoryId: string) {
    this.categoriesService.getCategory('2pToWGi9Brfi6hU34T3r');
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
    this.transactionsService.saveTransaction(transaction);
    this.openSnackBar(transaction.realized ? 'Transaction Realized' : 'Transaction Canceled');
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

}
