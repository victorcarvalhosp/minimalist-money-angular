import {Component} from '@angular/core';
import {UpdateSwService} from './services/update-sw.service';
import {AuthService} from './services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private updateSw: UpdateSwService, private authService: AuthService, private router: Router) {
    console.log(this.router.url);
    this.authService.getCurrentUser().then(user => {
      if (user && (this.router.url === '/login' || this.router.url === '/register'  || this.router.url === '/')) {
        this.router.navigate(['home', 'transactions']);
      } else {
        this.router.navigate(['site']);
      }
    }, (err) => {
      console.log('user not logged in');
    });
    console.log('APP COMPONENT');
  }
}
