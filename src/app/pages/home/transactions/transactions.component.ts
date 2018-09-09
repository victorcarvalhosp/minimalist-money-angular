import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/index';
import {TransactionsService} from '../../../services/transactions/transactions.service';
import {ITransaction} from '../../../models/transaction';
import {CategoriesService} from "../../../services/categories/categories.service";
import {ICategory} from "../../../models/category";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionsComponent implements OnInit {

  category: Observable<ICategory>
  transactions: Observable<ITransaction[]>;
  constructor(public transactionsService: TransactionsService, public categoriesService: CategoriesService) {
  // this.category = this.getCategory('123')
    this.getCategory('123');
  }

  handlePeriodLoaded(period) {
    console.log('period loaded');
    this.transactionsService.getTransactionsByDate(period);
    this.transactions = this.transactionsService.transactions;
  }

  getCategory(categoryId: string) {
    this.categoriesService.getCategory('2pToWGi9Brfi6hU34T3r');
  }

  ngOnInit() {
  }

}
