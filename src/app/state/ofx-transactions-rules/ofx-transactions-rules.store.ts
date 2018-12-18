import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {List} from 'immutable';
import {IOfxTransactionRule} from '../../models/ofx-transaction-rule';
import {OfxTransactionsRulesService} from '../../services/ofx-transactions-rules/ofx-transactions-rules.service';
import {getOfxIfClauseObjectField, OfxIfClauseEnum} from '../../enums/ofxIfClause.enum';
import {OperatorTypeEnum} from '../../enums/operator-type.enum';
import {ITransaction} from '../../models/transaction';
import {ITransactionOfx} from '../../models/transaction-ofx';

@Injectable({
  providedIn: 'root'
})
export class OfxTransactionsRulesStore {

  private _ofxTransactionsRule: BehaviorSubject<IOfxTransactionRule> = new BehaviorSubject<IOfxTransactionRule>({
    ifFieldClause: OfxIfClauseEnum.NAME,
    ifOperator: OperatorTypeEnum.IS_EQUAL_TO,
    ifValueClause: '',
    thenValueCategory: null,
    thenValueName: ''
  });
  private _ofxTransactionsRules: BehaviorSubject<List<IOfxTransactionRule>> = new BehaviorSubject(List([]));

  constructor(private afs: AngularFirestore, private ofxTransactionsRulesService: OfxTransactionsRulesService) {
    this.ofxTransactionsRulesService.initializeData().then(res => {
      this.initializeData();
    });
  }

  private initializeData() {
    this.ofxTransactionsRulesService.getAllOfxTransactionsRules().subscribe(res => {
      const ofxTransactionsRules: IOfxTransactionRule[] = res.map(
        a => {
          const data = a.payload.doc.data() as IOfxTransactionRule;
          data.id = a.payload.doc.id;
          return data;
        }
      );
      this._ofxTransactionsRules.next(List(ofxTransactionsRules));
    });
  }

  save(ofxTransactionsRule: IOfxTransactionRule): Observable<any> {
    return this.ofxTransactionsRulesService.save(ofxTransactionsRule);
  }

  delete(ofxTransactionsRule: IOfxTransactionRule): Observable<any> {
    return this.ofxTransactionsRulesService.delete(ofxTransactionsRule);
  }

  get ofxTransactionsRules() {
    return this._ofxTransactionsRules.asObservable();
  }

  applyRules(ofxTransaction: ITransactionOfx, transaction: ITransaction) {
    this.ofxTransactionsRules.subscribe(value => {
      console.log(value);
      value.forEach((rule: IOfxTransactionRule) => {
        // Implement custom operators later
        if (ofxTransaction[getOfxIfClauseObjectField(rule.ifFieldClause)] === rule.ifValueClause) {
          transaction.category = rule.thenValueCategory;
          transaction.name = rule.thenValueName;
        }
      });
    });
    // transaction.category = {color: '#66FF99',
    //   id: '13c0qc8X04zX2rhThQxg',
    //   name: 'Job'
    // };
  }
}
