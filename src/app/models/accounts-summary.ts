import {IAccountTotal} from './account-total';

export class IAccountsSumary {
  totalIncome: number;
  totalOutcome: number;
  total: number;
  accountsTotals: IAccountTotal[];
}
