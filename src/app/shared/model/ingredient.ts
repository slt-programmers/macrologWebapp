import { Food } from './food';
import { Portion } from './portion';

export interface Ingredient {

  id: number;
  food: Food;
  portion?: Portion; 
  multiplier: number; // Deprecated
  
  // grams?: number;
  // portionMultiplier?: number;
}
