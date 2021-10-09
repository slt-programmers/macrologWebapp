import { Food } from './food';
import { Portion } from './portion';

export class Ingredient {
  public food: Food;
  public portion: Portion; // makedish model
  public portionId: number; // dish page
  public multiplier = 1;

  constructor() {}
}
