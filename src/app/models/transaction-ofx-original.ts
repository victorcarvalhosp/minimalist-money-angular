import {TransactionTypeEnum} from '../enums/transaction-type.enum';
import {ITransaction} from './transaction';

export interface ITransactionOfxOriginal {
  TRNTYPE: string;
  DTPOSTED: string;
  TRNAMT: number;
  FITID: string;
  MEMO: string;
}
