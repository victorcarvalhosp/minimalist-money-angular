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
              public transactionsService: TransactionsService, public snackBar: MatSnackBar,
              public categoriesStore: CategoriesStore, public accountsService: AccountsService, private appService: AppService) {
    console.log('CONSTRUCTOR CALLED');
    this.isMobile = this.appService.isMobile;
    this.createForm();
    this.form.patchValue(this.data);
    this.accountsService.initializeData();
    this.form.get('category').setValue(this.data.category);
  }


  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      account: ['', Validators.compose([Validators.required])],
      realized: [''],
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
    this.transactionsService.deleteTransaction(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Transaction deleted!');
  }

  trySave(value) {
    this.showLoading();
    this.transactionsService.save(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Transaction Saved!');
    // this.transactionsService.save(value).then(res => {
    //   console.log('res');
    // });
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

