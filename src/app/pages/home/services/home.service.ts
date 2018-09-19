import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private _showBackButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showBackButton$: Observable<boolean> = this._showBackButton.asObservable();

  constructor() {
    this._showBackButton.next(false);
  }

  setShowBackButton(value: boolean) {
    this._showBackButton.next(value);
  }
}
