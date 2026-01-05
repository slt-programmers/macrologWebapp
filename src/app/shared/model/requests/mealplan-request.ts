import { Meal } from "../meal";
import { Weekday } from "../weekday";

export interface MealplanRequest {
  id: number;
  title: string;
  mealtimes: MealtimeRequest[];
}

export interface MealtimeRequest {
  id?: number;
  meal: Meal;
  weekday: Weekday;
  ingredients: IngredientRequest[];
}

export interface IngredientRequest {
  id?: number;
  foodId: number;
  portionId?: number;
  multiplier: number;
}
