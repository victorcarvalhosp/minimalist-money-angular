import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {IAccount} from '../../models/account';
import {AccountsService} from '../../services/accounts/accounts.service';
import {List} from 'immutable';

@Injectable({
  providedIn: 'root'
})
export class AccountsStore {

  private _account: BehaviorSubject<IAccount> = new BehaviorSubject<IAccount>({name: '', totals: []});
  private _accounts: BehaviorSubject<List<IAccount>> = new BehaviorSubject(List([]));

  constructor(private afs: AngularFirestore, private accountsService: AccountsService) {
    this.accountsService.initializeData().then(res => {
      this.initializeData();
    });
  }

  private initializeData() {
    this.accountsService.getAllAccounts();
    this.accountsService.getAllAccounts().subscribe(res => {
      const accounts: IAccount[] = res.map(
        a => {
          const data = a.payload.doc.data() as IAccount;
          data.id = a.payload.doc.id;
          return data;
        }
      );
      this._accounts.next(List(accounts));
    });
  }

  save(account: IAccount): Observable<any> {
    return this.accountsService.save(account);
  }

  delete(account: IAccount): Observable<any> {
    return this.accountsService.delete(account);
  }

  get accounts() {
    return this._accounts.asObservable();
  }
}
