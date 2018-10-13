import {IAccountTotal} from './account-total';

export class IPeriodSumary {
  previousBalance: number;
  totalIncome: number;
  expectedTotalIncome: number;
  totalOutcome: number;
  expectedTotalOutcome: number;
  total: number;
  expectedTotal: number;
}
