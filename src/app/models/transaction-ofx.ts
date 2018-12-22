import {TransactionTypeEnum} from '../enums/transaction-type.enum';
import {ITransaction} from './transaction';
import {IAccount} from "./account";

export interface ITransactionOfx {
  id?: string;
  bankTransactionId?: string;
  name: string;
  type: TransactionTypeEnum;
  reconciled?: boolean;
  amount: number;
  account: IAccount;
  date: Date;
  transactions: ITransaction[];
}
