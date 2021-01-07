import { Ingredient } from './ingredient';

export class Dish {
  public id: number;
  public ingredients: Ingredient[];
  public macrosCalculated: any;

  constructor(public name: string) {}
}
