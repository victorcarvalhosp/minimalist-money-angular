  import {OperatorTypeEnum} from '../enums/operator-type.enum';
import {OfxIfClauseEnum} from '../enums/ofxIfClause.enum';
  import {ICategory} from "./category";

export interface IOfxTransactionRuleAction {
  name: string;
  category?: ICategory;
}
