import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IPeriod} from '../../models/period';
import {AddMonthsPipe, LastDayOfMonthPipe, StartOfMonthPipe} from 'ngx-date-fns';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';
import {PeriodStore} from '../../state/period/period.store';
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

  constructor(public periodStore: PeriodStore) {

  }

  handleNextMonth() {
    this.changeMonth(1);
  }

  handlePreviousMonth() {
    this.changeMonth(-1);
  }

  changeMonth(months: number) {
    this.periodStore.changeMonth(months);
  }

  ngOnInit() {
    // this.periodStore.initializeData();
  }

}
