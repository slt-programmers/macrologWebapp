import { Food } from './food';
import { Portion } from './portion';

export interface Ingredient {

  food?: Food;
  portion?: Portion; // makedish model
  multiplier?: number;

}
