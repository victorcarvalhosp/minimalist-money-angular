import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/index';
import {TransactionsService} from '../../../services/transactions/transactions.service';
import {ITransaction} from '../../../models/transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionsComponent implements OnInit {

  transactions: Observable<ITransaction[]>;
  constructor(public transactionsService: TransactionsService) {
  }

  handlePeriodLoaded(period) {
    console.log('period loaded');
    this.transactionsService.getTransactionsByDate(period);
    this.transactions = this.transactionsService.transactions;
  }

  ngOnInit() {
  }

}
