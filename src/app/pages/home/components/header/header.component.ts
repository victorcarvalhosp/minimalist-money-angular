import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPeriod} from '../../../../models/period';
import {TransactionsService} from '../../../../services/transactions/transactions.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  showBackButton: Observable<boolean>;
// showBackButton: boolean;
  @Output()
  toggleBackButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
    // this.showBackButton = this.transactionsStore.showBackButton;
    // this.transactionsStore.showBackButton.subscribe((res:boolean) => {
    //   this.showBackButton = res;
    //   console.log(res);
    // });
  }

}
