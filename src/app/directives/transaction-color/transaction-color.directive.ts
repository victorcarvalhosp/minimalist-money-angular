import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {ITransaction} from "../../models/transaction";
import {TransactionTypeEnum} from "../../enums/transaction-type.enum";

@Directive({
  selector: '[appTransactionColor]'
})
export class TransactionColorDirective implements AfterViewInit {

  @Input('appTransactionColor') transaction: ITransaction;

  constructor(public el: ElementRef, public renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    let className = '';
    if (this.transaction.type === TransactionTypeEnum.INCOME) {
      className = 'income-color';
    } else if (this.transaction.type === TransactionTypeEnum.OUTCOME) {
      className = 'outcome-color';
    } else if (this.transaction.type === TransactionTypeEnum.TRANSFER) {
      className = 'transfer-color';
    }
    this.renderer.addClass(this.el.nativeElement, className);
  }


}
