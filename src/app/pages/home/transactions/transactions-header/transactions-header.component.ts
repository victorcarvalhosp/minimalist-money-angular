import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddMonthsPipe, LastDayOfMonthPipe, StartOfMonthPipe} from 'ngx-date-fns';
import {IPeriod} from '../../../../models/period';
import {TransactionTypeEnum} from '../../../../enums/transaction-type.enum';

@Component({
  selector: 'app-transactions-header',
  templateUrl: './transactions-header.component.html',
  styleUrls: ['./transactions-header.component.scss']
})
export class TransactionsHeaderComponent implements OnInit {

  @Output()
  periodLoaded: EventEmitter<IPeriod> = new EventEmitter<IPeriod>();

  @Output()
  openIncomeDialog: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  @Output()
  openOutcomeDialog: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  period: IPeriod;

  constructor() {

  }

  private setStartAndEndDates() {
    this.period.endDate = new LastDayOfMonthPipe().transform(this.period.datePeriod);
    this.period.endDate = new Date(this.period.endDate.getFullYear(), this.period.endDate.getMonth(),
      this.period.endDate.getDate(), 23, 59,59,59);
    console.log('datatata');
    console.log(this.period.endDate);
    this.period.startDate = new StartOfMonthPipe().transform(this.period.datePeriod);

  }

  handleNextMonth() {
    this.changeMonth(1);
  }

  handleOpenIncomeDialog() {
    this.openIncomeDialog.emit(TransactionTypeEnum.INCOME);
  }

  handleOpenOutcomeDialog() {
    this.openOutcomeDialog.emit(TransactionTypeEnum.OUTCOME);
  }

  handlePreviousMonth() {
    this.changeMonth(-1);
  }

  changeMonth(months: number) {
    this.period.datePeriod = new AddMonthsPipe().transform(this.period.datePeriod, months);
    this.setStartAndEndDates();
    this.periodLoaded.emit(this.period);
  }

  ngOnInit() {
    const datePeriod: Date = new Date();
    this.period =  {
      datePeriod: datePeriod,
    };
    this.setStartAndEndDates();
    this.periodLoaded.emit(this.period);
  }

}
