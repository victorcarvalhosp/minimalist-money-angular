import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validations} from '../../../../../validators/validations';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IAccount} from '../../../../../models/account';
import {AccountsService} from '../../../../../services/accounts/accounts.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  form: FormGroup;
  validations: Validations;
  loading: boolean = false;


  constructor(public dialogRef: MatDialogRef<CreateAccountComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IAccount, private fb: FormBuilder,
              private accountsService: AccountsService, public snackBar: MatSnackBar) {
    this.createForm();
    this.form.patchValue(this.data);
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])]
    });
    this.createValidatorsMessages();
  }

  private createValidatorsMessages() {
    this.validations = new Validations(
      {
        'name': {
          'required': 'Account name is required.',
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
    this.accountsService.delete(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Account deleted!');
  }

  trySave(value) {
    this.showLoading();
    this.accountsService.save(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Transaction Saved!');
    // this.accountsService.save(value).then(res => {
    //   console.log('res');
    // });
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

}
