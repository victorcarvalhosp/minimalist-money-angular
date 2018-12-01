export enum OperatorTypeEnum {
  IS_EQUAL_TO =	'IS_EQUAL_TO',
}

export function getOperatorTypeLabel(operatorType: OperatorTypeEnum) {
  if (!operatorType) {
    return null;
  } else if (operatorType === OperatorTypeEnum.IS_EQUAL_TO) {
    return 'is equal to';
  }
}
