import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validations} from "../../validators/validations";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  loginForm: FormGroup;
  validations: Validations;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(public authService: AuthService,
              private router: Router,
              private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      updateOn: 'blur'
    });
    this.createValidatorsMessages();
  }

  private createValidatorsMessages() {
    this.validations = new Validations(
      {
        'email': {
          'required': 'E-mail is required.',
          'email': 'Please enter a valid email address.',
        }
      }
    );
  }

  tryRecoverPassword(value) {
    this.showLoading();
    console.log(value);
    this.authService.doRecoverPassword(value.email)
      .then(res => {
        this.errorMessage = '';
        this.successMessage = 'An e-mail was sent to you. Follow the steps to recover your password.';
        this.hideLoading();
      }, err => {
        console.log(err);
        this.successMessage = '';
        this.errorMessage = err.message;
        this.hideLoading();
      });
  }

  private showLoading() {
    this.loading = true;
  }

  private hideLoading() {
    this.loading = false;
  }

  ngOnInit() {
  }

  getError(name: string) {
    const control = this.loginForm.get(name);
    return this.validations.getControlErrors(control);
  }

}
