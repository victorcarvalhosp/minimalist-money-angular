import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {AccountsService} from '../../../../services/accounts/accounts.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateAccountComponent} from './create-account/create-account.component';
import {IAccount} from "../../../../models/account";
import {AccountsStore} from "../../../../state/accounts/accounts.store";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);

  constructor(private breakpointObserver: BreakpointObserver, public accountsStore: AccountsStore,
              public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  openNewAccountDialog() {
    const category: IAccount = {
      name: '',
      totals: []
    };
    this.openDialog(category);
  }

  openDialog(category: IAccount): void {
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: category
    });

    const smallDialogSubscription = this.isSmall.subscribe(size => {
      if (size.matches) {
        dialogRef.updateSize('100%', '100%');
      } else {
        dialogRef.updateSize('50%');
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      smallDialogSubscription.unsubscribe();
    });
  }

}
