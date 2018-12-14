import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {Validations} from '../../validators/validations';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from '../../services/user/user.service';
import {IUser} from '../../models/credentials';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  validations: Validations;
  loading: boolean = false;
  hidePassword = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(public authService: AuthService,
              private router: Router,
              private fb: FormBuilder, private db: AngularFirestore, private userService: UserService) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(6)])],
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

  tryRegister(value) {
    this.showLoading();
    this.authService.doRegister(value)
      .then(res => {
        const user: IUser = {
          uid: res.user.uid,
          email: res.user.email,
          creationDate: new Date()
        };
        this.userService.createUser(user).then(res => {
          this.authService.doLogin(value).then(login => {
            this.router.navigate(['../home/transactions']);
            this.errorMessage = '';
            this.successMessage = 'Your account has been created';
            this.hideLoading();
          });
        });

      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = '';
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
    const control = this.registerForm.get(name);
    return this.validations.getControlErrors(control);
  }

}
