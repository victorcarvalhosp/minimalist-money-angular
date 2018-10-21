import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddMonthsPipe, LastDayOfMonthPipe, StartOfMonthPipe} from 'ngx-date-fns';
import {IPeriod} from '../../../../models/period';
import {TransactionTypeEnum} from '../../../../enums/transaction-type.enum';
import {Observable} from "rxjs";

@Component({
  selector: 'app-transactions-header',
  templateUrl: './transactions-header.component.html',
  styleUrls: ['./transactions-header.component.scss']
})
export class TransactionsHeaderComponent {

  @Output()
  openIncomeDialog: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  @Output()
  openOutcomeDialog: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  constructor() {

  }

  handleOpenIncomeDialog() {
    this.openIncomeDialog.emit(TransactionTypeEnum.INCOME);
  }

  handleOpenOutcomeDialog() {
    this.openOutcomeDialog.emit(TransactionTypeEnum.OUTCOME);
  }

}
