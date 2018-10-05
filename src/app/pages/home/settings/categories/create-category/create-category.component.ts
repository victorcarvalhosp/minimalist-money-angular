import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Validations} from '../../../../../validators/validations';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {ICategory} from '../../../../../models/category';
import {CategoriesService} from '../../../../../services/categories/categories.service';
import {CategoriesStore} from "../../../../../state/categories/categories.store";

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateCategoryComponent implements OnInit {

  form: FormGroup;
  validations: Validations;
  loading: boolean = false;


  constructor(public dialogRef: MatDialogRef<CreateCategoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ICategory, private fb: FormBuilder,
              private categoriesStore: CategoriesStore, public snackBar: MatSnackBar) {
    this.createForm();
    this.form.patchValue(this.data);
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])],
      color: ['', Validators.compose([Validators.required])],
    });
    this.createValidatorsMessages();
  }

  private createValidatorsMessages() {
    this.validations = new Validations(
      {
        'name': {
          'required': 'Category name is required.',
        },
        'color': {
          'required': 'Category color is required.',
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
    // this.categoriesService.delete(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Category deleted!');
  }

  trySave(value) {
    this.showLoading();
    this.categoriesStore.save(value);
    this.hideLoading();
    this.closeDialog();
    this.openSnackBar('Transaction Saved!');
    // this.categoriesService.save(value).then(res => {
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
