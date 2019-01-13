import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../services/auth/auth.service';
import {IUser} from '../../models/credentials';
import {take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private _loggedInUser: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.setLoggedInUserOnStore();
  }

  public setLoggedInUserOnStore(): Observable<IUser> {
    return this.authService.getLoggedInUser().pipe(take(2), tap(user => {
      console.log(user);
      localStorage.setItem('uid', user.uid);
        this._loggedInUser.next(user);
      }
    ));
  }

  get loggedInUser$() {
    return this._loggedInUser.asObservable();
  }

  get loggedInUser() {
    console.log(this._loggedInUser.getValue());
    console.log(this._loggedInUser);
    return this._loggedInUser.getValue();
  }

}
