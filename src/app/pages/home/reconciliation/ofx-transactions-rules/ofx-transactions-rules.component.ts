import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {CategoriesStore} from '../../../../state/categories/categories.store';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ICategory} from '../../../../models/category';
import {CreateCategoryComponent} from '../../settings/categories/create-category/create-category.component';
import {OfxTransactionsRulesStore} from '../../../../state/ofx-transactions-rules/ofx-transactions-rules.store';
import {IOfxTransactionRule} from '../../../../models/ofx-transaction-rule';
import {OfxIfClauseEnum} from '../../../../enums/ofxIfClause.enum';
import {OperatorTypeEnum} from '../../../../enums/operator-type.enum';
import {CreateOfxTransactionRuleComponent} from "./create-ofx-transaction-rule/create-ofx-transaction-rule.component";

@Component({
  selector: 'app-ofx-transactions-rules',
  templateUrl: './ofx-transactions-rules.component.html',
  styleUrls: ['./ofx-transactions-rules.component.scss']
})
export class OfxTransactionsRulesComponent implements OnInit {

  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);

  constructor(private breakpointObserver: BreakpointObserver, public ofxTransactionsRulesStore: OfxTransactionsRulesStore,
              public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  openNewOfxTransactionRuleDialog() {
    const ofxTransactionsRule: IOfxTransactionRule = {
      ifFieldClause: OfxIfClauseEnum.NAME,
      ifOperator: OperatorTypeEnum.IS_EQUAL_TO,
      ifValueClause: '',
      thenValueCategory: null,
      thenValueName: ''
    };
    this.openDialog(ofxTransactionsRule);
  }

  openDialog(ofxTransactionsRule: IOfxTransactionRule): void {
    const dialogRef = this.dialog.open(CreateOfxTransactionRuleComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: ofxTransactionsRule
    });

    const smallDialogSubscription = this.isSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('50%');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
  }

}
