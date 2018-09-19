import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {speedDialFabAnimations} from './speed-dial-fab.animation';
import {TransactionTypeEnum} from '../../enums/transaction-type.enum';

@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {

  @Output()
  action: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  fabButtons = [
    {
      icon: 'add',
      colorClass: 'income-color',
      type: TransactionTypeEnum.INCOME
    },
    {
      icon: 'remove',
      colorClass: 'outcome-color',
      type: TransactionTypeEnum.OUTCOME
    },
    {
      icon: 'transform',
      colorClass: 'transfer-color',
      type: TransactionTypeEnum.TRANSFER
    },
  ];
  buttons = [];
  fabTogglerState = 'inactive';

  constructor() { }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  handleClick(type: TransactionTypeEnum) {
    this.action.emit(type);
  }

  ngOnInit(): void {
  }

}
