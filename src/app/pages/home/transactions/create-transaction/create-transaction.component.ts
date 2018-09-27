import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ITransaction} from '../../../../models/transaction';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validations} from '../../../../validators/validations';
import {AngularFirestore} from '@angular/fire/firestore';
import {TransactionsService} from '../../../../services/transactions/transactions.service';
import {ICategory} from '../../../../models/category';
import {CategoriesService} from '../../../../services/categories/categories.service';

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

  constructor(public dialogRef: MatDialogRef<CreateTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ITransaction, private fb: FormBuilder, private db: AngularFirestore,
              public transactionsService: TransactionsService, public snackBar: MatSnackBar, public categoriesService: CategoriesService) {
    console.log('CONSTRUCTOR CALLED');
    this.createForm();
    this.form.patchValue(this.data);
    this.form.get('category').setValue(this.data.category);
    // this.categoriesService.categories$.subscribe(categories => {
    //   this.categories = categories;
    //   // categories.forEach(c => {
    //   //   if (c.id === this.data.category.id) {
    //   //     console.log(c);
    //   //     this.form.get('category').setValue(c);
    //   //   }
    //   // });
    // });
    // console.log(this.data.category);
    // this.form.controls['category'].patchValue(this.data.category);
    // console.log(this.form.controls['category'].value);
    // this.form.patchValue({'category': this.data.category});
  }


  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      realized: [''],
    });
    this.createValidatorsMessages();
  }

  formValue() {
    console.log(this.form);
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

  compareIds(category1: ICategory, category2: ICategory): boolean {
    return category1 && category2 ? category1.id === category2.id : category1 === category2;
  }
}

