import {TransactionTypeEnum} from '../enums/transaction-type.enum';
import {ITransaction} from './transaction';

export interface ITransactionOfx {
  id?: string;
  bankTransactionId?: string;
  name: string;
  type: TransactionTypeEnum;
  reconciled?: boolean;
  amount: number;
  date: Date;
  transactions: ITransaction[];
}
