import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validations} from "../../../../validators/validations";
import {AccountsStore} from "../../../../state/accounts/accounts.store";
import {TransactionsStore} from "../../../../state/transactions/transactions.store";
import {TransactionsOfxStore} from "../../../../state/transactions-ofx/transactions-ofx.store";
import {IImportOfx} from "../../../../models/import-ofx";
import {Router} from "@angular/router";
import {FileUploader} from "ng2-file-upload";

@Component({
  selector: 'app-import-ofx-file-details',
  templateUrl: './import-ofx-file-details.component.html',
  styleUrls: ['./import-ofx-file-details.component.scss']
})
export class ImportOfxFileDetailsComponent implements OnInit {

  form: FormGroup;
  validations: Validations;
  loading: boolean = false;
  URL: any = 'https://evening-anchorage-3159.herokuapp.com/api/';
  public uploader: FileUploader = new FileUploader({url: this.URL});

  constructor(public dialogRef: MatDialogRef<ImportOfxFileDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public accountsStore: AccountsStore,
              private transactionsOfxStore: TransactionsOfxStore,
              private router: Router) {
    this.createForm();
    if (this.data) {
      const files: File[] = [];
      for (const file of this.data) {
        files.push(file);
      }
      this.uploader.addToQueue(files);
    }
  }

  createForm() {
    this.form = this.fb.group({
      account: ['', Validators.compose([Validators.required])],
    });
    this.createValidatorsMessages();
  }

  private createValidatorsMessages() {
    this.validations = new Validations(
      {
        'account': {
          'required': 'Account is required.',
        },
      }
    );
  }

  getError(name: string) {
    const control = this.form.get(name);
    return this.validations.getControlErrors(control);
  }

  importOfxFiles() {
    const importOfx: IImportOfx = {files: this.uploader.queue, account: this.form.controls['account'].value};
    this.transactionsOfxStore.importOfxFile(importOfx);
    this.router.navigate(['/home/reconciliation']);
    this.dialogRef.close();
  }

  onFilesAdded() {
    console.log(this.form.controls['files'].value);
    // const files: { [key: string]: File } = this.file.nativeElement.files;
    // for (let key in files) {
    //   if (!isNaN(parseInt(key))) {
    //     this.files.add(files[key]);
    //   }
    // }
  }

  ngOnInit() {
  }

  compareIds(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

}
