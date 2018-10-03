import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../auth/auth.service';
import {AccountsService} from '../accounts/accounts.service';
import {IAccountAmountAggregation} from '../../models/account_amount_aggregation';

@Injectable({
  providedIn: 'root'
})
export class TotalsService {

  constructor(private afs: AngularFirestore, private authService: AuthService, private accountsService: AccountsService) { }

  getTotal(date: Date) {
    this.accountsService.getAccounts().then(value => {
      value.forEach(account => {
        console.log('VALUE NOW');
        console.log(account.id);
      });

    });
  }
}
