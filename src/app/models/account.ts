import {IAccountTotal} from './account-total';

export interface IAccount {
  id?: string;
  name: string;
  totals: IAccountTotal[];
}
