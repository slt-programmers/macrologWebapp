import { Food } from './food';
import { Macros } from './macros';
import { Meal } from './meal';
import { Portion } from './portion';

export interface Entry {

  id?: number;
  meal?: Meal;
  food?: Food;
  portion?: Portion;
  multiplier?: number;
  day?: string;
  macrosCalculated?: Macros;

}
