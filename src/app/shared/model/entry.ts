import { Food } from './food';
import { Portion } from './portion';

export interface Entry {

  id?: number;
  meal?: string;
  food?: Food;
  portion?: Portion;
  multiplier?: number;
  day?: Date;
  macrosCalculated?: any;

}
