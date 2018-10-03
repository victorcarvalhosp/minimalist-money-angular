import {IAccountAmountAggregation} from './account_amount_aggregation';

export class IAccount {
  id?: string;
  name: string;
  totals: IAccountAmountAggregation[];
}
