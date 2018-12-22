import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ITransaction} from '../../../../models/transaction';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validations} from '../../../../validators/validations';
import {AngularFirestore} from '@angular/fire/firestore';
import {ICategory} from '../../../../models/category';
import {AppService} from '../../../../services/app/app.service';
import {CategoriesStore} from '../../../../state/categories/categories.store';
import {AccountsStore} from '../../../../state/accounts/accounts.store';
import {TransactionsStore} from '../../../../state/transactions/transactions.store';
import {CreateCategoryComponent} from '../../settings/categories/create-category/create-category.component';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

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
  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);


  constructor(public dialogRef: MatDialogRef<CreateTransactionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ITransaction, private fb: FormBuilder, private db: AngularFirestore,
              public transactionStore: TransactionsStore, public snackBar: MatSnackBar,
              public categoriesStore: CategoriesStore, public accountsStore: AccountsStore, private appService: AppService,
              public dialog: MatDialog, private breakpointObserver: BreakpointObserver) {
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
      name: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      category: [null, Validators.compose([Validators.required])],
      account: ['', Validators.compose([Validators.required])],
      repeat: [false],
      parcels: [1],
      showParcels: [false],
      realized: [true],
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
          'required': 'Account is required.',
        },
        'parcels': {
          'required': 'Number of parcels is required.',
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
    this.transactionStore.delete(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Transaction deleted!');
  }

  trySave(value) {
    this.showLoading();
    this.transactionStore.save(value);
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

  openNewCategoryDialog() {
    const category: ICategory = {
      name: '',
    };
    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: category
    });

    const smallDialogSubscription = this.isSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('50%');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.form.value.category = result;
      console.log(this.form.value);
      smallDialogSubscription.unsubscribe();
    });
  }

  toggleNumberParcelsToOneWhenDontRepeat() {
    console.log(this.form.controls['repeat'].value);
    if (!this.form.value.repeat) {
      this.form.controls['parcels'].setValue(1);
    }
  }

  compareIds(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}

