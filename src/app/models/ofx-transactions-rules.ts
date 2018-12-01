  import {OperatorTypeEnum} from '../enums/operator-type.enum';
import {OfxIfClauseEnum} from '../enums/ofxIfClause.enum';

export interface IOfxTransactionsRule {
  id?: string;
  ifFieldClause: OfxIfClauseEnum;
  ifOperator: OperatorTypeEnum;
  ifValueClause: string;
  actions: any[];
}
