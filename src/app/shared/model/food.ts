import { Portion } from './portion';

export interface Food {

  id?: number;
  portions: Portion[];
  name: string;
  protein: number;
  fat: number;
  carbs: number;

}
