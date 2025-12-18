import { Ingredient } from "./ingredient";
import { Meal } from "./meal";
import { Weekday } from "./weekday";

export interface Mealtime {
  id: number;
  meal: Meal;
  weekday: Weekday;
  ingredients: Ingredient[];
}

