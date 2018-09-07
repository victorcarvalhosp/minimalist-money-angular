import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {Observable} from 'rxjs';
import {tap, map, take} from 'rxjs/operators';
import {AuthService} from "../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.authService.getCurrentUser()
        .then(user => {
          console.log('GUARD');
          console.log(user);
          return resolve(true);
        }, err => {
          this.router.navigate(['/login']);
          return resolve(false);
        })
    })
  }
}
