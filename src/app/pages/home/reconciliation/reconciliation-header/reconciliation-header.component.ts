import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TransactionTypeEnum} from "../../../../enums/transaction-type.enum";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reconciliation-header',
  templateUrl: './reconciliation-header.component.html',
  styleUrls: ['./reconciliation-header.component.scss']
})
export class ReconciliationHeaderComponent {

  @Output()
  openIncomeDialog: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  @Output()
  openOutcomeDialog: EventEmitter<TransactionTypeEnum> = new EventEmitter<TransactionTypeEnum>();

  @Output()
  openOfxTransactionRulesDialog: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  openImportOfxDialog: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {
  }

  handleOpenOfxTransactionRulesDialogDialog() {
    this.openOfxTransactionRulesDialog.emit();
  }

  handleOpenIncomeDialog() {
    this.openIncomeDialog.emit(TransactionTypeEnum.INCOME);
  }

  handleOpenOutcomeDialog() {
    this.openOutcomeDialog.emit(TransactionTypeEnum.OUTCOME);
  }

  handleOpenImportOfxDialog() {
    this.openImportOfxDialog.emit();
  }

  redirectToTransactions() {
    this.router.navigate(['home', 'transactions']);
  }

}
