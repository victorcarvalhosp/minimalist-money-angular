import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {ITransaction} from "../../models/transaction";
import {TransactionTypeEnum} from "../../enums/transaction-type.enum";

@Directive({
  selector: '[appTransactionCircleColor]'
})
export class TransactionCircleColorDirective implements AfterViewInit {

  @Input("appTransactionCircleColor") transaction: ITransaction;

  constructor(public el: ElementRef, public renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    let className = '';
    if (this.transaction.type === TransactionTypeEnum.INCOME) {
      className = 'income';
    } else if (this.transaction.type === TransactionTypeEnum.OUTCOME) {
      className = 'outcome';
    } else if (this.transaction.type === TransactionTypeEnum.TRANSFER) {
      className = 'transfer';
    }
    if (this.transaction.realized) {
      this.renderer.addClass(this.el.nativeElement, 'realized');
      className += '-realized';
    }
    this.renderer.addClass(this.el.nativeElement, className);
  }


}
