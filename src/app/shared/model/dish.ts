import { Ingredient } from './ingredient';

export interface Dish {

  id?: number;
  name: string;
  ingredients: Ingredient[];
  macrosCalculated?: any;

}
