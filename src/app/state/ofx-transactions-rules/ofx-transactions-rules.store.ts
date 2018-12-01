import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {List} from 'immutable';
import {IOfxTransactionsRule} from '../../models/ofx-transactions-rules';
import {OfxTransactionsRulesService} from '../../services/ofx-transactions-rules/ofx-transactions-rules.service';
import {getOfxIfClauseObjectField, OfxIfClauseEnum} from '../../enums/ofxIfClause.enum';
import {OperatorTypeEnum} from '../../enums/operator-type.enum';
import {ITransaction} from '../../models/transaction';
import {ITransactionOfx} from '../../models/transaction-ofx';

@Injectable({
  providedIn: 'root'
})
export class OfxTransactionsRulesStore {

  private _ofxTransactionsRule: BehaviorSubject<IOfxTransactionsRule> = new BehaviorSubject<IOfxTransactionsRule>({
    ifFieldClause: OfxIfClauseEnum.NAME,
    ifOperator: OperatorTypeEnum.IS_EQUAL_TO,
    ifValueClause: '',
    actions: []
  });
  private _ofxTransactionsRules: BehaviorSubject<List<IOfxTransactionsRule>> = new BehaviorSubject(List([]));

  constructor(private afs: AngularFirestore, private ofxTransactionsRulesService: OfxTransactionsRulesService) {
    this.ofxTransactionsRulesService.initializeData().then(res => {
      this.initializeData();
    });
    console.log('INITIALIZE CATEGORIES STORE');
  }

  private initializeData() {
    this.ofxTransactionsRulesService.getAllOfxTransactionsRules().subscribe(res => {
      const ofxTransactionsRules: IOfxTransactionsRule[] = res.map(
        a => {
          const data = a.payload.doc.data() as IOfxTransactionsRule;
          data.id = a.payload.doc.id;
          return data;
        }
      );
      this._ofxTransactionsRules.next(List(ofxTransactionsRules));
    });
  }

  save(ofxTransactionsRule: IOfxTransactionsRule): Observable<any> {
    return this.ofxTransactionsRulesService.save(ofxTransactionsRule);
  }

  delete(ofxTransactionsRule: IOfxTransactionsRule): Observable<any> {
    return this.ofxTransactionsRulesService.delete(ofxTransactionsRule);
  }

  get ofxTransactionsRules() {
    return this._ofxTransactionsRules.asObservable();
  }

  applyRules(ofxTransaction: ITransactionOfx, transaction: ITransaction) {
    this.ofxTransactionsRules.subscribe(value => {
      console.log(value);
      value.forEach((rule: IOfxTransactionsRule) => {
        //Implement custom operators later
        if (ofxTransaction[getOfxIfClauseObjectField(rule.ifFieldClause)] === rule.ifValueClause) {
          transaction = Object.assign(transaction, rule.actions);
        }
      });
    });
    // transaction.category = {color: '#66FF99',
    //   id: '13c0qc8X04zX2rhThQxg',
    //   name: 'Job'
    // };
  }
}
