import { Ingredient } from './ingredient';
import { Macros } from './macros';

export interface Dish {

  id?: number;
  name: string;
  ingredients: Ingredient[];
  macrosCalculated: Macros;

}
