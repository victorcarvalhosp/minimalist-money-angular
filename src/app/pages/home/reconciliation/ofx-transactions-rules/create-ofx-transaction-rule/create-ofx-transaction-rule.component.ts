import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validations} from '../../../../../validators/validations';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {CategoriesStore} from '../../../../../state/categories/categories.store';
import {OfxTransactionsRulesStore} from '../../../../../state/ofx-transactions-rules/ofx-transactions-rules.store';
import {IOfxTransactionRule} from '../../../../../models/ofx-transaction-rule';
import {OfxIfClauseEnum} from '../../../../../enums/ofxIfClause.enum';
import {OperatorTypeEnum} from '../../../../../enums/operator-type.enum';

@Component({
  selector: 'app-create-ofx-transaction-rule',
  templateUrl: './create-ofx-transaction-rule.component.html',
  styleUrls: ['./create-ofx-transaction-rule.component.scss']
})
export class CreateOfxTransactionRuleComponent implements OnInit {


  form: FormGroup;
  validations: Validations;
  loading: boolean = false;


  constructor(public dialogRef: MatDialogRef<CreateOfxTransactionRuleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IOfxTransactionRule, private fb: FormBuilder,
              private ofxTransactionsRulesStore: OfxTransactionsRulesStore, public snackBar: MatSnackBar, public categoriesStore: CategoriesStore) {
    this.createForm();
    this.form.patchValue(this.data);
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      ifFieldClause: [OfxIfClauseEnum.NAME, Validators.compose([Validators.required])],
      ifOperator: [OperatorTypeEnum.IS_EQUAL_TO, Validators.compose([Validators.required])],
      ifValueClause: ['', Validators.compose([Validators.required])],
      thenValueName: ['', Validators.compose([Validators.required])],
      thenValueCategory: ['', Validators.compose([Validators.required])],
    });
    this.createValidatorsMessages();
  }

  private createValidatorsMessages() {
    this.validations = new Validations(
      {
        'ifValueClause': {
          'required': 'Ofx transaction name is required.',
        },
        'thenValueCategory': {
          'required': 'Category is required.',
        },
        'thenValueName': {
          'required': 'Name is required.',
        }
      }
    );
  }

  getError(name: string) {
    const control = this.form.get(name);
    return this.validations.getControlErrors(control);
  }

  private showLoading() {
    this.loading = true;
  }

  private hideLoading() {
    this.loading = false;
  }


  tryDelete(value) {
    this.showLoading();
    this.ofxTransactionsRulesStore.delete(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Rule deleted!');
  }

  trySave(value) {
    this.showLoading();
    this.ofxTransactionsRulesStore.save(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Rule Saved!');
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

  ngOnInit() {
  }

  compareIds(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

}
