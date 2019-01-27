import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Validations} from "../../validators/validations";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import {UserService} from "../../services/user/user.service";
import {IUser} from "../../models/credentials";
import {UserStore} from "../../state/user/user.store";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  validations: Validations;
  loading: boolean = false;
  hidePassword = true;
  errorMessage: string = '';

  constructor(public authService: AuthService,
              private router: Router,
              private fb: FormBuilder, private db: AngularFirestore,
              private userService: UserService, private userStore: UserStore) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
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
        },
        'password': {
          'required': 'Password is required.',
          'minlength': 'Please enter at least 6 characters.',
        }
      }
    );
  }

  tryLogin(value) {
    this.showLoading();
    this.authService.doLogin(value)
      .then(res => {
        this.userStore.setLoggedInUserOnStore().subscribe(res => {
          this.router.navigate(['../home/transactions']);
          this.errorMessage = '';
          this.hideLoading();
        });
      }, err => {
        console.log(err);
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
