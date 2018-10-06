import {IAccountTotal} from './account-total';

export class IAccount {
  id?: string;
  name: string;
  totals: IAccountTotal[];
}
