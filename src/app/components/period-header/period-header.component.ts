import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IPeriod} from '../../models/period';
import {AddMonthsPipe, LastDayOfMonthPipe, StartOfMonthPipe} from 'ngx-date-fns';

@Component({
  selector: 'app-period-header',
  templateUrl: './period-header.component.html',
  styleUrls: ['./period-header.component.scss']
})
export class PeriodHeaderComponent implements OnInit {

  @Output()
  periodLoaded: EventEmitter<IPeriod> = new EventEmitter<IPeriod>();
  period: IPeriod;

  constructor() {

  }

  private setStartAndEndDates() {
    this.period.endDate = new LastDayOfMonthPipe().transform(this.period.datePeriod);
    this.period.startDate = new StartOfMonthPipe().transform(this.period.datePeriod);
  }

  handleNextMonth() {
    this.changeMonth(1);

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
      endDate:  new LastDayOfMonthPipe().transform(datePeriod),
      startDate: new StartOfMonthPipe().transform(datePeriod)
    };
    this.periodLoaded.emit(this.period);
  }

}
