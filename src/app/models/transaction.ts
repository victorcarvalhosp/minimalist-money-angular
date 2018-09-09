import {TransactionTypeEnum} from '../enums/transaction-type.enum';

export class ITransaction {
  name: string;
  description?: string
  type: TransactionTypeEnum;
  realized: boolean;
  amount: number;
  date: Date;
}
