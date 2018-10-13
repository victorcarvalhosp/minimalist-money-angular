import {Component, Inject, OnInit} from '@angular/core';
import {TransactionsFooterComponent} from "../transactions-footer.component";
import {MatBottomSheetRef} from "@angular/material";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';
import {Observable} from "rxjs";
import {IPeriodSumary} from "../../../../../models/period-summary";


@Component({
  selector: 'app-transactions-footer-details',
  templateUrl: './transactions-footer-details.component.html',
  styleUrls: ['./transactions-footer-details.component.scss']
})
export class TransactionsFooterDetailsComponent implements OnInit {

  periodSummary: Observable<IPeriodSumary>;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: Observable<IPeriodSumary>,
              private bottomSheetRef: MatBottomSheetRef<TransactionsFooterDetailsComponent>) {
    this.periodSummary = this.data;
  }

  ngOnInit() {
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
