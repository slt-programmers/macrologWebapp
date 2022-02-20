import { Food } from './food';
import { Macros } from './macros';
import { Portion } from './portion';

export interface Entry {

  id?: number;
  meal?: string;
  food?: Food;
  portion?: Portion;
  multiplier?: number;
  day?: string;
  macrosCalculated?: Macros;

}
