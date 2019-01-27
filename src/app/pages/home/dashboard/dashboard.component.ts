import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {TransactionsStore} from "../../../state/transactions/transactions.store";
import {TransactionTypeEnum} from "../../../enums/transaction-type.enum";
import {AccountTotalsStore} from "../../../state/account-totals/account-totals.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];
  public chartColors: any[] = [];
  public backgroundColor: string[] = [];
  public doughnutChartType: string = 'doughnut';
  public barChartOptions: any = {
    legend: {position: 'bottom'}
  };
  private subscription: any;

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(public transactionsStore: TransactionsStore, public accountTotalsStore: AccountTotalsStore) {
    this.subscription = this.transactionsStore.transactions.subscribe(transactions => {
      console.log('INSIDE SUBSCRIBE');
      this.doughnutChartLabels = [];
      this.doughnutChartData = [];
      this.backgroundColor = [];
      this.chartColors = [];
      if (transactions.size > 0) {
        transactions.forEach(transaction => {
          if (transaction.type === TransactionTypeEnum.OUTCOME) {
            if (!this.arrayContainsCategory(this.doughnutChartLabels, transaction.category.name)) {
              this.doughnutChartLabels.push(transaction.category.name);
              this.doughnutChartData.push(transaction.amount);
              this.backgroundColor.push(transaction.category.color);
              console.log(transaction.category.color);
            } else {
              const index = this.doughnutChartLabels.indexOf(transaction.category.name);
              this.doughnutChartData[index] = this.doughnutChartData[index] + transaction.amount;
            }
          }
        });
        this.chartColors.push({backgroundColor: this.backgroundColor});
      }
    });
  }

  arrayContainsCategory(array, categoryName) {
    return (array.indexOf(categoryName) > -1);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
