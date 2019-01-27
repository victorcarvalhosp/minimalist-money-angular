import {Component} from '@angular/core';
import {UpdateSwService} from './services/update-sw.service';
import {AuthService} from './services/auth/auth.service';
import {Router} from '@angular/router';
import {UserStore} from "./state/user/user.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router, private userStore: UserStore) {
    this.userStore.setLoggedInUserOnStore().subscribe(
      user => {
        if (user) {
          this.router.navigate(['home', 'transactions']);
        } else {
          this.router.navigate(['site']);
        }
      },
      err => {
        this.router.navigate(['site']);
      });
  }
}
