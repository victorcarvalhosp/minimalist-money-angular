export enum TransactionTypeEnum {
  INCOME =	'INCOME',
  OUTCOME	= 'OUTCOME',
  TRANSFER = 'TRANSFER'
}

export function getTransactionTypeLabel(transactionType: TransactionTypeEnum) {
  if (!transactionType) {
    return null;
  } else if (transactionType === TransactionTypeEnum.INCOME) {
    return 'Income';
  } else if (transactionType === TransactionTypeEnum.OUTCOME) {
    return 'Outcome';
  } else if (transactionType === TransactionTypeEnum.TRANSFER) {
    return 'Transfer';
  }
}

export function isIncome(transactionType: TransactionTypeEnum) {
  return transactionType === TransactionTypeEnum.INCOME;
}
