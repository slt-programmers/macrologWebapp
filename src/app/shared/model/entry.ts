import { Food } from './food';
import { Macros } from './macros';
import { Meal } from './meal';
import { Portion } from './portion';

export interface Entry {

  id: number;
  meal: Meal;
  food: Food;
  // grams: number;

  portion?: Portion;
  // portionMultiplier?: number;

  day: string;
  macrosCalculated: Macros;

  multiplier?: number; // Deprecated

}
