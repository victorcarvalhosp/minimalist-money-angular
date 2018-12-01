import {TransactionTypeEnum} from '../enums/transaction-type.enum';
import {ICategory} from './category';
import {IAccount} from './account';

export interface ITransaction {
  id?: string;
  name: string;
  description?: string;
  type: TransactionTypeEnum;
  realized: boolean;
  amount: number;
  date: Date;
  category?: ICategory;
  account?: IAccount;
  recurring?: boolean;
  recurringDontShowParcel?: boolean;
  preReconciled?: boolean;
  reconciled?: boolean;
  ofxTransactionId?: string;
}
