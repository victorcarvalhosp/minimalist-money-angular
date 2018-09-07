import { AbstractControl, FormArray } from "@angular/forms";

export class Validations {

  validationMessages: any;

  constructor(validationMessages: any) {
    this.validationMessages = validationMessages;
  }

  getControlErrors(control: AbstractControl) {
    const isFormArray = control instanceof FormArray;
    if (control.pending || control.valid || !isFormArray && !control.touched) {
      return '';
    } else {
      const controlName = this.getControlName(control);
      const controlValidations = this.validationMessages[controlName];
      const firstErrorKey = Object.keys(control.errors)[0];
      return controlValidations[firstErrorKey];
    }
  }

  getControlName(c: AbstractControl): string | null {
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }

}
