import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IPeriod} from '../../models/period';
import {AddMonthsPipe, LastDayOfMonthPipe, StartOfMonthPipe} from "ngx-date-fns";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PeriodStore {

  private _period: BehaviorSubject<IPeriod> = new BehaviorSubject<IPeriod>(
    {datePeriod: new Date() }
    );
  public loading: boolean = true;

  constructor() {
    this.initializeData();
  }

  public initializeData() {
    this.loading = true;
    const datePeriod: Date = new Date();
    const period =  {
      datePeriod: datePeriod,
    };
    this.setStartAndEndDates(period);
  }

  private setStartAndEndDates(period: IPeriod) {
    period.endDate = new LastDayOfMonthPipe().transform(period.datePeriod);
    period.endDate = new Date(period.endDate.getFullYear(), period.endDate.getMonth(),
    period.endDate.getDate(), 23, 59,59,59);
    period.startDate = new StartOfMonthPipe().transform(period.datePeriod);
    this._period.next(period);
    this.loading = false;
  }

  public changeMonth(months: number) {
    const period = this._period.value;
    period.datePeriod = new AddMonthsPipe().transform(period.datePeriod, months);
    this.setStartAndEndDates(period);
  }


  get period() {
    return this._period.asObservable();
  }
}
