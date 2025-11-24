import { Food } from './food';
import { Portion } from './portion';

export interface Ingredient {

  food: Food;
  
  grams?: number;
  portion?: Portion; 
  portionMultiplier?: number;

  multiplier: number; // Deprecated

}
