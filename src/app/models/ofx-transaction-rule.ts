  import {OperatorTypeEnum} from '../enums/operator-type.enum';
import {OfxIfClauseEnum} from '../enums/ofxIfClause.enum';
  import {IOfxTransactionRuleAction} from './ofx-transaction-rule-action';

export interface IOfxTransactionRule {
  id?: string;
  ifFieldClause: OfxIfClauseEnum;
  ifOperator: OperatorTypeEnum;
  ifValueClause: string;
  actions: IOfxTransactionRuleAction;
}
