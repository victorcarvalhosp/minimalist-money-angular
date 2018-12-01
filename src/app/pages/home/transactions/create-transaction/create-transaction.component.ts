import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ITransaction} from '../../../../models/transaction';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validations} from '../../../../validators/validations';
import {AngularFirestore} from '@angular/fire/firestore';
import {TransactionsService} from '../../../../services/transactions/transactions.service';
import {ICategory} from '../../../../models/category';
import {CategoriesService} from '../../../../services/categories/categories.service';
import {AppService} from "../../../../services/app/app.service";
import {AccountsService} from "../../../../services/accounts/accounts.service";
import {CategoriesStore} from "../../../../state/categories/categories.store";
import {AccountsStore} from "../../../../state/accounts/accounts.store";
import {TransactionsStore} from "../../../../state/transactions/transactions.store";

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {
  form: FormGroup;
  validations: Validations;
  loading: boolean = false;
  categories: ICategory[];
  isMobile: boolean = false;

  constructor(public dialogRef: MatDialogRef<CreateTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ITransaction, private fb: FormBuilder, private db: AngularFirestore,
              public transactionService: TransactionsStore, public snackBar: MatSnackBar,
              public categoriesStore: CategoriesStore, public accountsStore: AccountsStore, private appService: AppService) {
    console.log('CONSTRUCTOR CALLED');
    this.isMobile = this.appService.isMobile;
    this.createForm();
    this.form.patchValue(this.data);
    this.form.get('category').setValue(this.data.category);
    if (this.data.reconciled) {
      this.form.get('amount').disable();
      this.form.get('realized').disable();
      this.form.get('account').disable();
      this.form.get('date').disable();
    }
  }


  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['',  Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      account: ['', Validators.compose([Validators.required])],
      realized: [''],
      preReconciled: [false],
      reconciled: [false],
      ofxTransactionId: ['']
    });
    this.createValidatorsMessages();
  }

  private createValidatorsMessages() {
    this.validations = new Validations(
      {
        'name': {
          'required': 'Transaction name is required.',
        },
        'amount': {
          'required': 'Amount is required.',
        },
        'category': {
          'required': 'Category is required.',
        },
        'account': {
          'required': 'Category is required.',
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
    this.transactionService.delete(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Transaction deleted!');
  }

  trySave(value) {
    this.showLoading();
    this.transactionService.save(value);
    this.hideLoading();
    this.closeDialogAfterSave(value);
    this.openSnackBar('Transaction Saved!');
    // this.transactionsStore.save(value).then(res => {
    //   console.log('res');
    // });
  }

  closeDialogAfterSave(value) {
    this.dialogRef.close(value);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

  compareIds(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}

