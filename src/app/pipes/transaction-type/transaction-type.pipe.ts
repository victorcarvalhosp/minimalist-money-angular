import { Pipe, PipeTransform } from '@angular/core';
import {getTransactionTypeLabel, TransactionTypeEnum} from '../../enums/transaction-type.enum';

@Pipe({
  name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

  transform(value: TransactionTypeEnum, args?: any): any {
    return getTransactionTypeLabel(value);
  }

}
