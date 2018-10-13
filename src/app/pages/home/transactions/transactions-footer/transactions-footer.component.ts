import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IPeriodSumary} from '../../../../models/period-summary';
import {MatBottomSheet} from '@angular/material';
import {TransactionsFooterDetailsComponent} from './transactions-footer-details/transactions-footer-details.component';

@Component({
  selector: 'app-transactions-footer',
  templateUrl: './transactions-footer.component.html',
  styleUrls: ['./transactions-footer.component.scss']
})
export class TransactionsFooterComponent implements OnInit {

  @Input()
  periodSummary: Observable<IPeriodSumary>;
  @Input()
  loading: boolean;

  constructor(private bottomSheet: MatBottomSheet) { }

  openBottomSheet(data: Observable<IPeriodSumary>): void {
    this.bottomSheet.open(TransactionsFooterDetailsComponent, {data: data});
  }

  ngOnInit() {
  }

}
