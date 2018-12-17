  import {OperatorTypeEnum} from '../enums/operator-type.enum';
import {OfxIfClauseEnum} from '../enums/ofxIfClause.enum';
  import {IOfxTransactionRuleAction} from './ofx-transaction-rule-action';
  import {Validators} from "@angular/forms";
  import {ICategory} from "./category";

export interface IOfxTransactionRule {
  id?: string;
  ifFieldClause: OfxIfClauseEnum;
  ifOperator: OperatorTypeEnum;
  ifValueClause: string;
  thenValueName: string;
  thenValueCategory: ICategory;
}
