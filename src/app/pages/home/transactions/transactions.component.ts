import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionsService} from '../../../services/transactions/transactions.service';
import {ITransaction} from '../../../models/transaction';
import {CategoriesService} from '../../../services/categories/categories.service';
import {ICategory} from '../../../models/category';
import {HomeService} from '../services/home.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CreateTransactionComponent} from './create-transaction/create-transaction.component';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {TransactionTypeEnum} from '../../../enums/transaction-type.enum';
import {AccountsService} from '../../../services/accounts/accounts.service';
import {IPeriod} from '../../../models/period';
import {TransactionsStore} from '../../../state/transactions/transactions.store';
import {AccountTotalsStore} from '../../../state/account-totals/account-totals.store';
import {SubSecondsPipe} from 'ngx-date-fns';
import {PeriodSummaryStore} from '../../../state/period-summary/period-summary.store';
import {map, switchMap, finalize} from 'rxjs/operators';
import {FileUploader, } from 'ng2-file-upload';
import {AngularFireStorage} from '@angular/fire/storage';
import {parse as parseOFX} from 'ofx-js';




@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionsComponent implements OnInit {

  isSmall: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]);
  total: number;
  URL: any = 'https://evening-anchorage-3159.herokuapp.com/api/';


  constructor(private breakpointObserver: BreakpointObserver, public homeService: HomeService,
              public transactionsStore: TransactionsStore,
              public dialog: MatDialog, public snackBar: MatSnackBar, public periodSummaryStore: PeriodSummaryStore, private storage: AngularFireStorage) {
    // this.transactionsStore.getTransactionsByDate();
    // this.periodSummaryStore.calculateTotals();

  }

  public uploader: FileUploader = new FileUploader({url: this.URL});

  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public dropped(event: FileList) {
    console.log(event);
    const file = event[0];
    const filePath = 'name-your-file-path-here';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL() )
    )
      .subscribe();

    const fileReader = new FileReader();
    // const ofxString: string = 'OFXHEADER:100' +
    //   'DATA:OFXSGML' +
    //   'VERSION:102' +
    //   'SECURITY:NONE' +
    //   'ENCODING:USASCII' +
    //   'CHARSET:1252' +
    //   'COMPRESSION:NONE' +
    //   'OLDFILEUID:NONE' +
    //   'NEWFILEUID:NONE' +
    //   '' +
    //   '<OFX>' +
    //   '<SIGNONMSGSRSV1>' +
    //   '<SONRS>' +
    //   '<STATUS>' +
    //   '<CODE>0' +
    //   '<SEVERITY>INFO' +
    //   '</STATUS>' +
    //   '<DTSERVER>20121004210819' +
    //   '<LANGUAGE>ENG' +
    //   '</SONRS>' +
    //   '</SIGNONMSGSRSV1>' +
    //   '<BANKMSGSRSV1>' +
    //   '<STMTTRNRS>' +
    //   '<TRNUID>1349428292' +
    //   '<STATUS>' +
    //   '<CODE>0' +
    //   '<SEVERITY>INFO' +
    //   '</STATUS>' +
    //   '<STMTRS>' +
    //   '<CURDEF>NZD' +
    //   '<BANKACCTFROM>' +
    //   '<BANKID>01' +
    //   '<BRANCHID>0123' +
    //   '<ACCTID>1234567-00' +
    //   '<ACCTTYPE>SAVINGS' +
    //   '</BANKACCTFROM>' +
    //   '<BANKTRANLIST>' +
    //   '<DTSTART>20120101' +
    //   '<DTEND>20121003' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>INT' +
    //   '<DTPOSTED>20120928' +
    //   '<TRNAMT>19.90' +
    //   '<FITID>20120928.0' +
    //   '<MEMO>Credit Interest Paid' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT' +
    //   '<DTPOSTED>20120928' +
    //   '<TRNAMT>-1.01' +
    //   '<FITID>20120928.1' +
    //   '<MEMO>Withholding Tax' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT' +
    //   '<DTPOSTED>20120907' +
    //   '<TRNAMT>-100.00' +
    //   '<FITID>20120907.0' +
    //   '<NAME>06 0773 0214764 33' +
    //   '<MEMO>Debit Transfer: Bike' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT' +
    //   '<DTPOSTED>20120907' +
    //   '<TRNAMT>-71.99' +
    //   '<FITID>201209071' +
    //   '<NAME>Transfer' +
    //   '<MEMO>Debit Transfer: Postage' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT' +
    //   '<DTPOSTED>20120104' +
    //   '<TRNAMT>-20.01' +
    //   '<FITID>20120104.6' +
    //   '<NAME>Transfer' +
    //   '<MEMO>Debit Transfer Party' +
    //   '</STMTTRN>' +
    //   '</BANKTRANLIST>' +
    //   '<LEDGERBAL>' +
    //   '<BALAMT>4225.79' +
    //   '<DTASOF>20121004' +
    //   '</LEDGERBAL>' +
    //   '<AVAILBAL>' +
    //   '<BALAMT>12.79' +
    //   '<DTASOF>20121004' +
    //   '</AVAILBAL>' +
    //   '</STMTRS>' +
    //   '</STMTTRNRS>' +
    //   '</BANKMSGSRSV1>' +
    //   '</OFX>';

    // let ofxString: string = 'OFXHEADER:100' +
    //   'DATA:OFXSGML' +
    //   'VERSION:102' +
    //   'SECURITY:NONE' +
    //   'ENCODING:USASCII' +
    //   'CHARSET:1252' +
    //   'COMPRESSION:NONE' +
    //   'OLDFILEUID:NONE' +
    //   'NEWFILEUID:NONE' +
    //   '<OFX>' +
    //   '<SIGNONMSGSRSV1>' +
    //   '<SONRS>' +
    //   '<STATUS>' +
    //   '<CODE>0</CODE>' +
    //   '<SEVERITY>INFO</SEVERITY>' +
    //   '</STATUS>' +
    //   '<DTSERVER>20181024120000[-3:BRT]</DTSERVER>' +
    //   '<LANGUAGE>POR</LANGUAGE>' +
    //   '<FI>' +
    //   '<ORG>Banco Cooperativo do Brasil</ORG>' +
    //   '<FID>756</FID>' +
    //   '</FI>' +
    //   '</SONRS>' +
    //   '</SIGNONMSGSRSV1>' +
    //   '<BANKMSGSRSV1>' +
    //   '<STMTTRNRS>' +
    //   '<TRNUID>1</TRNUID>' +
    //   '<STATUS>' +
    //   '<CODE>0</CODE>' +
    //   '<SEVERITY>INFO</SEVERITY>' +
    //   '</STATUS>' +
    //   '<STMTRS>' +
    //   '<CURDEF>BRL</CURDEF>' +
    //   '<BANKACCTFROM>' +
    //   '<BANKID>756</BANKID>' +
    //   '<BRANCHID>3078-3</BRANCHID>' +
    //   '<ACCTID>13518-6</ACCTID>' +
    //   '<ACCTTYPE>CHECKING</ACCTTYPE>' +
    //   '</BANKACCTFROM>' +
    //   '<BANKTRANLIST>' +
    //   '<DTSTART>20180901120000[-3:BRT]</DTSTART>' +
    //   '<DTEND>20180930120000[-3:BRT]</DTEND>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>CREDIT</TRNTYPE>' +
    //   '<DTPOSTED>20180906120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>478.20</TRNAMT>' +
    //   '<FITID>20180906478201</FITID>' +
    //   '<CHECKNUM>0000030180</CHECKNUM>' +
    //   '<REFNUM>0000030180</REFNUM>' +
    //   '<MEMO>CRÉD.LIQUIDAÇÃO COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180906120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-2.10</TRNAMT>' +
    //   '<FITID>201809062101</FITID>' +
    //   '<CHECKNUM>0000030180</CHECKNUM>' +
    //   '<REFNUM>0000030180</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>CREDIT</TRNTYPE>' +
    //   '<DTPOSTED>20180910120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>346.69</TRNAMT>' +
    //   '<FITID>20180910346691</FITID>' +
    //   '<CHECKNUM>0000030159</CHECKNUM>' +
    //   '<REFNUM>0000030159</REFNUM>' +
    //   '<MEMO>CRÉD.LIQUIDAÇÃO COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180910120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-2.10</TRNAMT>' +
    //   '<FITID>201809102101</FITID>' +
    //   '<CHECKNUM>0000030159</CHECKNUM>' +
    //   '<REFNUM>0000030159</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>CREDIT</TRNTYPE>' +
    //   '<DTPOSTED>20180913120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>356.71</TRNAMT>' +
    //   '<FITID>20180913356711</FITID>' +
    //   '<CHECKNUM>0000030134</CHECKNUM>' +
    //   '<REFNUM>0000030134</REFNUM>' +
    //   '<MEMO>CRÉD.LIQUIDAÇÃO COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180913120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-2.10</TRNAMT>' +
    //   '<FITID>201809132101</FITID>' +
    //   '<CHECKNUM>0000030134</CHECKNUM>' +
    //   '<REFNUM>0000030134</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>CREDIT</TRNTYPE>' +
    //   '<DTPOSTED>20180914120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>362.76</TRNAMT>' +
    //   '<FITID>20180914362761</FITID>' +
    //   '<CHECKNUM>0000030141</CHECKNUM>' +
    //   '<REFNUM>0000030141</REFNUM>' +
    //   '<MEMO>CRÉD.LIQUIDAÇÃO COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180914120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-2.10</TRNAMT>' +
    //   '<FITID>201809142101</FITID>' +
    //   '<CHECKNUM>0000030141</CHECKNUM>' +
    //   '<REFNUM>0000030141</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>CREDIT</TRNTYPE>' +
    //   '<DTPOSTED>20180917120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>2026.75</TRNAMT>' +
    //   '<FITID>201809172026751</FITID>' +
    //   '<CHECKNUM>0000030048</CHECKNUM>' +
    //   '<REFNUM>0000030048</REFNUM>' +
    //   '<MEMO>CRÉD.LIQUIDAÇÃO COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180917120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-10.50</TRNAMT>' +
    //   '<FITID>2018091710501</FITID>' +
    //   '<CHECKNUM>0000030048</CHECKNUM>' +
    //   '<REFNUM>0000030048</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180918120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-420.00</TRNAMT>' +
    //   '<FITID>20180918420001</FITID>' +
    //   '<CHECKNUM>1324108</CHECKNUM>' +
    //   '<REFNUM>1324108</REFNUM>' +
    //   '<MEMO>DEBITO EMISSÃO TED DIF.TITULARIDADE</MEMO>' +
    //   '<NAME>Adriano Fidelis pagamento gesso indenizacao ap</NAME>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180918120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-8.00</TRNAMT>' +
    //   '<FITID>201809188001</FITID>' +
    //   '<CHECKNUM>188</CHECKNUM>' +
    //   '<REFNUM>188</REFNUM>' +
    //   '<MEMO>TED INTERNET</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180925120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-2640.14</TRNAMT>' +
    //   '<FITID>201809252640141</FITID>' +
    //   '<CHECKNUM>1335521</CHECKNUM>' +
    //   '<REFNUM>1335521</REFNUM>' +
    //   '<MEMO>DEBITO EMISSÃO TED DIF.TITULARIDADE</MEMO>' +
    //   '<NAME>CLM Administradora de condominio pagamentos realizado pela admi</NAME>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180925120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-8.00</TRNAMT>' +
    //   '<FITID>201809258001</FITID>' +
    //   '<CHECKNUM>188</CHECKNUM>' +
    //   '<REFNUM>188</REFNUM>' +
    //   '<MEMO>TED INTERNET</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180926120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-4.00</TRNAMT>' +
    //   '<FITID>201809264001</FITID>' +
    //   '<CHECKNUM>0000000033</CHECKNUM>' +
    //   '<REFNUM>0000000033</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>CREDIT</TRNTYPE>' +
    //   '<DTPOSTED>20180927120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>365.26</TRNAMT>' +
    //   '<FITID>20180927365261</FITID>' +
    //   '<CHECKNUM>0000030030</CHECKNUM>' +
    //   '<REFNUM>0000030030</REFNUM>' +
    //   '<MEMO>CRÉD.LIQUIDAÇÃO COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '<STMTTRN>' +
    //   '<TRNTYPE>DEBIT</TRNTYPE>' +
    //   '<DTPOSTED>20180927120000[-3:BRT]</DTPOSTED>' +
    //   '<TRNAMT>-2.10</TRNAMT>' +
    //   '<FITID>201809272101</FITID>' +
    //   '<CHECKNUM>0000030030</CHECKNUM>' +
    //   '<REFNUM>0000030030</REFNUM>' +
    //   '<MEMO>TARIFA COBRANÇA</MEMO>' +
    //   '</STMTTRN>' +
    //   '</BANKTRANLIST>' +
    //   '<LEDGERBAL>' +
    //   '<BALAMT>3073.54</BALAMT>' +
    //   '<DTASOF>20180927120000[-3:BRT]</DTASOF>' +
    //   '</LEDGERBAL>' +
    //   '</STMTRS>' +
    //   '</STMTTRNRS>' +
    //   '</BANKMSGSRSV1>' +
    //   '</OFX>';
    let ofxString: string = '';

    // let ofxString;
    fileReader.onload = () => {
      // console.log(fileReader.result);
      ofxString = fileReader.result+' ';
      console.log(ofxString);
      parseOFX(ofxString).then(ofxData => {
        console.log(ofxData);
        if (ofxData.OFX.BANKMSGSRSV1) {
          const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
          const accountId = statementResponse.BANKACCTFROM.ACCTID;
          const currencyCode = statementResponse.CURDEF;
          const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
          console.log(accountId);
          console.log(transactionStatement);
        } else if (ofxData.OFX.CREDITCARDMSGSRSV1) {
          const statementResponse = ofxData.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS;
          const accountId = statementResponse.CCACCTFROM.ACCTID;
          const currencyCode = statementResponse.CURDEF;
          const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
          console.log(accountId);
          console.log(transactionStatement);
        }

        // do something...
      });
    };
    fileReader.readAsText(file);
    // parseOFX(ofxString).then(ofxData => {
    //   console.log(ofxData);
    //   const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
    //   const accountId = statementResponse.BANKACCTFROM.ACCTID;
    //   const currencyCode = statementResponse.CURDEF;
    //   const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
    //   console.log(accountId);
    //   console.log(transactionStatement);
    //   // do something...
    // });
    // const ofxString: string = fileReader.readAsText(file) + '';

  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  openDialogNewTransaction(type: TransactionTypeEnum): void {
    const newTransaction: ITransaction = {
      id: '',
      name: '',
      date: new Date(),
      amount: 0,
      type: type,
      realized: false
    };
    this.openDialog(newTransaction);
  }

  openDialog(transaction: ITransaction): void {
    const dialogRef = this.dialog.open(CreateTransactionComponent, {
      width: '50%',
      maxWidth: '100wh',
      maxHeight: '100vh',
      disableClose: true,
      data: transaction
    });

    const smallDialogSubscription = this.isSmall.subscribe(size => {
        console.log(size);
        if (size.matches) {
          dialogRef.updateSize('100%', '100%');
        } else {
          dialogRef.updateSize('50%');
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      smallDialogSubscription.unsubscribe();
      // this.animal = result;
    });
  }

  showDetails(transaction: ITransaction) {
    console.log('CLICK');
    // this.homeService.setShowBackButton(true);
    this.openDialog(transaction);
  }

  ngOnInit() {
  }

  toggleRealized(transaction: ITransaction) {
    console.log('toogle realized');
    transaction.realized = !transaction.realized;
    this.transactionsStore.save(transaction);
    this.openSnackBar(transaction.realized ? 'Transaction Realized' : 'Transaction Canceled');
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }

}
